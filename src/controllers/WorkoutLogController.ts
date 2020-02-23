import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler = require('express-async-handler');
import WorkoutLog from '../models/WorkoutLog';
import { IUser } from '../interfaces/user';
import { runValidation } from '../utils/runValidation';
import { CreateLogSchema, UpdateLogSchema } from '../validation/LogSchema';
import { ErrorResponse } from '../utils/ErrorResponse';

/**
 * * Method     GET
 * * Endpoint   /api/logs
 * * Access     Public
 */
export const getLogs = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const logs = await WorkoutLog.find({
      user: (req.user as IUser)._id
    })
      .populate('workout', { _id: 1, name: 1, description: 1 })
      .populate('user', { fid: 1, username: 1, email: 1, avatar: 1 });

    res.status(200).json({ success: true, data: logs });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/logs/completed
 * * Access     Public
 */
export const getCompletedWorkouts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const logs = await WorkoutLog.find({
      $and: [{ user: (req.user as IUser)._id }, { completed: true }]
    })
      .populate('workout', { _id: 1, name: 1, description: 1 })
      .populate('user', { fid: 1, username: 1, email: 1, avatar: 1 });

    res.status(200).json({ success: true, data: logs });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/logs/pending
 * * Access     Public
 */
export const getPendingWorkouts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const logs = await WorkoutLog.find({
      $and: [{ user: (req.user as IUser)._id }, { completed: false }]
    })
      .populate('workout', { _id: 1, name: 1, description: 1 })
      .populate('user', { fid: 1, username: 1, email: 1, avatar: 1 });

    res.status(200).json({ success: true, data: logs });
  }
);

/**
 * * Method     POST
 * * Endpoint   /api/logs
 * * Access     Public
 */
export const addLog = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(CreateLogSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const workoutLog = new WorkoutLog({
      user: (req.user as IUser)._id,
      ...req.body
    });

    await workoutLog.save();

    res.status(200).json({ success: true, data: workoutLog });
  }
);

/**
 * * Method     DELETE
 * * Endpoint   /api/logs/:id
 * * Access     Public
 */
export const deleteLog = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const workoutLog = await WorkoutLog.findOneAndRemove({
      $and: [{ user: (req.user as IUser)._id }, { _id: req.params.id }]
    });

    if (!workoutLog) {
      return next(new ErrorResponse(404, 'Log not found'));
    }

    res.status(200).json({ success: true });
  }
);

/**
 * * Method     PATCH
 * * Endpoint   /api/logs/:id
 * * Access     Public
 */
export const updateLog = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(UpdateLogSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const workoutLog = await WorkoutLog.findOneAndUpdate(
      {
        $and: [{ user: (req.user as IUser)._id }, { _id: req.params.id }]
      },
      { ...req.body },
      { new: true }
    );

    if (!workoutLog) {
      return next(new ErrorResponse(404, 'Log not found'));
    }

    res.status(200).json({ success: true, data: workoutLog });
  }
);
