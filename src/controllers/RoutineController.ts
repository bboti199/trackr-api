import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler = require('express-async-handler');
import Routine from '../models/Routine';
import { IUser } from '../interfaces/user';
import { runValidation } from '../utils/runValidation';
import {
  CreateRoutineSchema,
  CreateProgressInfoSchema
} from '../validation/RoutineSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import { CreateRoutineDto } from '../dto/RoutineDto';
import { checkIfExists } from '../utils/CheckIfExists';
import Exercise from '../models/Exercise';
import ProgressInfo from '../models/ProgressInfo';

/**
 * * Method     GET
 * * Endpoint   /api/routines
 * * Access     Private
 */
export const getRoutines = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const routines = await Routine.find({
      owner: (req.user as IUser)._id
    }).populate('routineData.exercise');

    res.status(200).json({
      success: true,
      data: routines
    });
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

    res.status(201).json({
      success: true,
      data: newRoutine
    });
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

    res.status(200).json({
      success: true,
      data: routine
    });
  }
);
