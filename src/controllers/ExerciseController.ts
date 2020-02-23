import { Request, Response, NextFunction } from 'express';
import Exercise from '../models/Exercise';
import { runValidation } from '../utils/runValidation';
import {
  CreateExerciseSchema,
  UpdateExerciseSchema
} from '../validation/ExerciseSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import { CreateExerciseDto } from '../dto/ExerciseDto';
import { IUser, UserRoles } from '../interfaces/user';
import { groupBy } from 'lodash';
import expressAsyncHandler from 'express-async-handler';
import { RedisClient } from '../RedisClient';

/**
 * * Method     GET
 * * Endpoint   /api/exercises
 * * Access     Private
 */
export const getExercises = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userKey = `exercises_${(req.user as IUser).id}`;
    let cachedExercises = await RedisClient.get(userKey);

    if (cachedExercises) {
      cachedExercises = JSON.parse(cachedExercises);
      return res.status(200).json({
        source: 'cache',
        success: true,
        count: cachedExercises?.length,
        data: cachedExercises
      });
    }

    const exercises = await Exercise.find({
      $or: [{ owner: null }, { owner: (req.user as IUser)._id }]
    });

    await RedisClient.setex(userKey, 1800, JSON.stringify(exercises));

    res.status(200).json({
      source: 'api',
      success: true,
      count: exercises.length,
      data: exercises
    });
  }
);

/**
 * * Method     POST
 * * Endpoint   /api/exercises
 * * Access     Private
 */
export const addExercise = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(CreateExerciseSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const createExerciseDto: CreateExerciseDto = req.body;

    const exercise = new Exercise({
      ...createExerciseDto,
      owner: (req.user as IUser)._id
    });

    await exercise.save();

    await RedisClient.del(`exercises_${(req.user as IUser).id}`);

    res.status(201).json({ success: true, data: exercise });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/exercises/grouped
 * * Access     Private
 */
export const getExercisesGrouped = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userKey = `exercises_${(req.user as IUser).id}`;
    let cachedExercises = await RedisClient.get(userKey);
    let exercises = [];
    let source = '';

    if (cachedExercises) {
      exercises = JSON.parse(cachedExercises);
      source = 'cache';
    } else {
      exercises = await Exercise.find({
        $or: [{ owner: null }, { owner: (req.user as IUser)._id }]
      });
      source = 'api';
    }

    const data = groupBy(exercises, exercise => {
      return exercise.bodyPart;
    });

    res.status(200).json({
      source,
      success: true,
      count: exercises.length,
      data
    });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/exercises/compound
 * * Access     Private
 */
export const getCompoundExercises = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userKey = `exercises_${(req.user as IUser).id}`;
    let cachedExercises = await RedisClient.get(userKey);
    let exercises = [];
    let source = '';

    if (cachedExercises) {
      exercises = JSON.parse(cachedExercises);
      source = 'cache';
    } else {
      exercises = await Exercise.find({
        $and: [
          { type: 'compound' },
          { $or: [{ owner: null }, { owner: (req.user as IUser)._id }] }
        ]
      });
      source = 'api';
    }

    res.status(200).json({
      source,
      success: true,
      count: exercises.length,
      data: exercises
    });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/exercises/isolation
 * * Access     Private
 */
export const getIsolationExercises = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userKey = `exercises_${(req.user as IUser).id}`;
    let cachedExercises = await RedisClient.get(userKey);
    let exercises = [];
    let source = '';

    if (cachedExercises) {
      exercises = JSON.parse(cachedExercises);
      source = 'cache';
    } else {
      exercises = await Exercise.find({
        $and: [
          { type: 'isolation' },
          { $or: [{ owner: null }, { owner: (req.user as IUser)._id }] }
        ]
      });
      source = 'api';
    }

    res.status(200).json({
      source: 'api',
      success: true,
      count: exercises.length,
      data: exercises
    });
  }
);

/**
 * * Method     DELETE
 * * Endpoint   /api/exercises/:id
 * * Access     Private
 */
export const deleteExercise = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    if ((req.user as IUser).role === UserRoles.admin) {
      const exercise = await Exercise.findByIdAndRemove(req.params.id);
      return res.status(200).json({ success: true, data: exercise });
    }

    const exercise = await Exercise.findOne({
      $and: [{ owner: req.user, _id: req.params.id }]
    });

    if (!exercise) {
      return next(new ErrorResponse(404, 'Exercise not found'));
    }

    await exercise.remove();

    await RedisClient.del(`exercises_${(req.user as IUser).id}`);

    res.status(200).json({ success: true, data: exercise });
  }
);

/**
 * * Method     PATCH
 * * Endpoint   /api/exercises/:id
 * * Access     Private
 */
export const updateExercise = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(UpdateExerciseSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const updateExerciseDto: CreateExerciseDto = req.body;

    const exercise = await Exercise.findOneAndUpdate(
      { $and: [{ _id: req.params.id }, { owner: (req.user as IUser)._id }] },
      updateExerciseDto,
      { new: true }
    );

    await RedisClient.del(`exercises_${(req.user as IUser).id}`);

    return res.status(200).json({ success: true, data: exercise });
  }
);
