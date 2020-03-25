import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler = require('express-async-handler');
import Routine from '../models/Routine';
import { IUser } from '../interfaces/user';
import { runValidation } from '../utils/runValidation';
import {
  CreateRoutineSchema,
  UpdateRoutineSchema,
  UpdateRoutineDataSchema,
  GetProgressInfoSchema
} from '../validation/RoutineSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import {
  CreateRoutineDto,
  UpdateRoutineProgressDtoItem
} from '../dto/RoutineDto';
import { checkIfExists } from '../utils/CheckIfExists';
import Exercise from '../models/Exercise';
import moment from 'moment';
import { extractChartData } from '../utils/ExtractChartData';

/**
 * * Method     GET
 * * Endpoint   /api/routines
 * * Access     Private
 */
export const getRoutines = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const routines = await Routine.find({
      owner: (req.user as IUser)._id
    }).populate('routineData.exercise', {
      name: 1,
      bodyPart: 1,
      type: 1,
      _id: 1
    });

    res.status(200).json({
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
    }).populate('routineData.exercise', {
      name: 1,
      bodyPart: 1,
      type: 1,
      _id: 1
    });

    if (!routine) {
      return next(new ErrorResponse(404, 'Routine not found'));
    }

    res.status(200).json({ success: true, data: routine });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/routines/:routineId/progress/chart/:timePeriod
 * * Params     { week, month, year, all, default: month }
 * * Access     Private
 */
export const getChartDataForRoutine = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(GetProgressInfoSchema, req.params);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const routine = await Routine.findOne({
      $and: [{ _id: req.params.routineId }, { owner: (req.user as IUser)._id }]
    }).populate('routineData.exercise', {
      name: 1,
      bodyPart: 1,
      type: 1,
      _id: 1
    });

    if (!routine) {
      return next(new ErrorResponse(404, 'Routine not found'));
    }

    let timePeriodDate;

    if (req.params.timePeriod === 'all') {
      timePeriodDate = moment(new Date(0));
    } else {
      timePeriodDate = moment().subtract(1, req.params.timePeriod as any);
    }

    const data = extractChartData(routine, timePeriodDate);

    res.status(200).json({ success: true, data });
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

    console.log(JSON.stringify(routineDto, null, 2));

    const newRoutine = new Routine({
      ...routineDto,
      owner: (req.user as IUser)._id
    });

    await newRoutine.save();

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

    res.status(200).json({
      success: true
    });
  }
);

/**
 * * Method     POST
 * * Endpoint   /api/routines/:routineId/progress
 * * Access     Private
 */
export const updateProgress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(UpdateRoutineDataSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const routine = await Routine.findOne({
      $and: [{ _id: req.params.routineId }, { owner: (req.user as IUser)._id }]
    });

    if (!routine) {
      return next(new ErrorResponse(404, 'Routine not found'));
    }

    const progressData: [UpdateRoutineProgressDtoItem] = req.body;

    progressData.map(progressDataItem => {
      routine.routineData.map(routineDataItem => {
        if (
          progressDataItem.exercise.toString() ===
          routineDataItem.exercise.toString()
        ) {
          routineDataItem.progress.unshift(progressDataItem.progress as any);
        }
      });
    });

    await routine.save();

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
/*export const deleteProgressData = expressAsyncHandler(
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

    res.status(200).json({
      success: true
    });
  }
);*/

/**
 * * Method     PATCH
 * * Endpoint   /api/routines/progress/:progressInfoId
 * * Access     Private
 */
/*export const updateProgressInfo = expressAsyncHandler(
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

    res.status(200).json({
      success: true,
      data: progressInfo
    });
  }
);*/
