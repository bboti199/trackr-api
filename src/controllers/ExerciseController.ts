import asnycHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import Exercise from '../models/Exercise';
import { runValidation } from '../utils/runValidation';
import { CreateExerciseSchema } from '../validation/ExerciseSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import { CreateExerciseDto } from '../dto/ExerciseDto';
import { IUser, UserRoles } from '../interfaces/user';
import { groupBy } from 'lodash';

/**
 * * Method     GET
 * * Endpoint   /api/exercises
 * * Access     Private
 */
export const getExercises = asnycHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const exercises = await Exercise.find({
      $or: [{ owner: null }, { owner: (req.user as IUser)._id }]
    });

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
export const addExercise = asnycHandler(
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

    res.status(201).json({ success: true, data: exercise });
  }
);

/**
 * * Method     GET
 * * Endpoint   /api/exercises/grouped
 * * Access     Private
 */
export const getExercisesGrouped = asnycHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const exercises = await Exercise.find({
      $or: [{ owner: null }, { owner: (req.user as IUser)._id }]
    });

    const data = groupBy(exercises, exercise => {
      return exercise.bodyPart;
    });

    res.status(200).json({
      source: 'api',
      success: true,
      count: exercises.length,
      data
    });
  }
);

/**
 * * Method     DELETE
 * * Endpoint   /api/exercises/:id
 * * Access     Private
 */
export const deleteExercise = asnycHandler(
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

    res.status(200).json({ success: true, data: exercise });
  }
);
