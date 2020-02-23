import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler = require('express-async-handler');
import Routine from '../models/Routine';
import { IUser } from '../interfaces/user';
import { runValidation } from '../utils/runValidation';
import {
  CreateRoutineSchema,
  CreateProgressInfoSchema,
  UpdateRoutineSchema,
  UpdateProgressInfoSchema
} from '../validation/RoutineSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import { CreateRoutineDto } from '../dto/RoutineDto';
import { checkIfExists } from '../utils/CheckIfExists';
import Exercise from '../models/Exercise';
import ProgressInfo from '../models/ProgressInfo';
import { RedisClient } from '../RedisClient';

/**
 * * Method     GET
 * * Endpoint   /api/routines
 * * Access     Private
 */
export const getRoutines = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userKey = `routines_${(req.user as IUser).id}`;
    let cachedRoutines = await RedisClient.get(userKey);

    if (cachedRoutines) {
      cachedRoutines = JSON.parse(cachedRoutines);
      return res.status(200).json({
        source: 'cache',
        success: true,
        count: cachedRoutines?.length,
        data: cachedRoutines
      });
    }

    const routines = await Routine.find({
      owner: (req.user as IUser)._id
    })
      .populate('routineData.exercise', {
        name: 1,
        bodyPart: 1,
        type: 1,
        _id: 0
      })
      .populate('routineData.progress', { updatedAt: 0, __v: 0 });

    await RedisClient.setex(userKey, 1800, JSON.stringify(routines));

    res.status(200).json({
      source: 'api',
      success: true,
      count: routines.length,
      data: routines
    });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/routines/:routineId
 * * Access     Private
 */
export const getRoutineById = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findOne({
      $and: [{ _id: req.params.routineId }, { owner: (req.user as IUser)._id }]
    })
      .populate('routineData.exercise', {
        name: 1,
        bodyPart: 1,
        type: 1,
        _id: 0
      })
      .populate('routineData.progress', { updatedAt: 0, __v: 0 });

    if (!routine) {
      return next(new ErrorResponse(404, 'Routine not found'));
    }

    res.status(200).json({ success: true, data: routine });
  }
);

/**
 * * Method     POST
 * * Endpoint   /api/routines
 * * Access     Private
 */
export const createRoutine = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(CreateRoutineSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const routineDto: CreateRoutineDto = req.body;
    const exercises = routineDto.routineData.map(data => data.exercise);

    const exercisesOk = await checkIfExists(Exercise, exercises);

    if (!exercisesOk) {
      return next(new ErrorResponse(400, 'Invalid exercise found'));
    }

    const newRoutine = new Routine({
      ...routineDto,
      owner: (req.user as IUser)._id
    });

    await newRoutine.save();

    await RedisClient.del(`routines_${(req.user as IUser).id}`);

    res.status(201).json({
      success: true,
      data: newRoutine
    });
  }
);

/**
 * * Method     PATCH
 * * Endpoint   /api/routines/:routineId
 * * Access     Private
 */
export const updateRoutine = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(UpdateRoutineSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const routine = await Routine.findOneAndUpdate(
      {
        $and: [
          { _id: req.params.routineId },
          { owner: (req.user as IUser)._id }
        ]
      },
      req.body,
      { new: true }
    );

    if (!routine) {
      return next(new ErrorResponse(404, 'Routine not found'));
    }

    await RedisClient.del(`routines_${(req.user as IUser).id}`);

    res.status(200).json({ success: true, data: routine });
  }
);

/**
 * * Method     DELETE
 * * Endpoint   /api/routines/:routineId
 * * Access     Private
 */
export const deleteRoutine = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const routine = await Routine.findOne({
      $and: [{ _id: req.params.routineId }, { owner: (req.user as IUser)._id }]
    });

    if (routine) {
      await routine.remove();
    } else {
      return next(new ErrorResponse(404, 'Routine not found!'));
    }

    await RedisClient.del(`routines_${(req.user as IUser).id}`);

    res.status(200).json({
      success: true
    });
  }
);

/**
 * * Method     POST
 * * Endpoint   /api/routines/:routineId/:exerciseId/progress
 * * Access     Private
 */
export const updateProgress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(CreateProgressInfoSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const routine = await Routine.findOne({
      $and: [{ _id: req.params.routineId }, { owner: (req.user as IUser)._id }]
    });

    if (!routine) {
      return next(new ErrorResponse(404, 'Routine not found'));
    }

    const progressInfo = new ProgressInfo({
      ...req.body,
      exercise: req.params.exerciseId,
      routine: req.params.routineId
    });

    await progressInfo.save();

    routine.routineData.map(data => {
      if (data.exercise.toString() === req.params.exerciseId) {
        data.progress.push(progressInfo);
      }
    });

    await routine.save();

    await RedisClient.del(`routines_${(req.user as IUser).id}`);

    res.status(200).json({
      success: true,
      data: routine
    });
  }
);

/**
 * * Method     DELETE
 * * Endpoint   /api/routines/progress/:progressInfoId
 * * Access     Private
 */
export const deleteProgressData = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const progressInfo = await ProgressInfo.findById(req.params.progressInfoId);

    if (!progressInfo) {
      return next(new ErrorResponse(404, 'Progress data not found'));
    }

    const routine = await Routine.findOne({
      $and: [{ owner: (req.user as IUser)._id }, { _id: progressInfo.routine }]
    });

    if (!routine) {
      return next(new ErrorResponse(404, 'Corresponding routine not found'));
    }

    const dataIdx = routine.routineData.findIndex(
      data => data.exercise.toString() === progressInfo.exercise.toString()
    );

    if (dataIdx > -1) {
      const progressInfoIdx = routine.routineData[dataIdx].progress.findIndex(
        info => info._id.toString() === progressInfo._id.toString()
      );
      routine.routineData[dataIdx].progress.splice(progressInfoIdx, 1);
    }

    await routine.save();

    await progressInfo.remove();

    await RedisClient.del(`routines_${(req.user as IUser).id}`);

    res.status(200).json({
      success: true
    });
  }
);

/**
 * * Method     PATCH
 * * Endpoint   /api/routines/progress/:progressInfoId
 * * Access     Private
 */
export const updateProgressInfo = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(UpdateProgressInfoSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const progressInfo = await ProgressInfo.findOneAndUpdate(
      {
        _id: req.params.progressInfoId
      },
      req.body,
      { new: true }
    );

    if (!progressInfo) {
      return next(new ErrorResponse(404, 'Progress data not found'));
    }

    await RedisClient.del(`routines_${(req.user as IUser).id}`);

    res.status(200).json({
      success: true,
      data: progressInfo
    });
  }
);
