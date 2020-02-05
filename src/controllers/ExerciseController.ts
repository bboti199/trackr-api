import asnycHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import Exercise from '../models/Exercise';
import { runValidation } from '../utils/runValidation';
import { CreateExerciseSchema } from '../validation/ExerciseSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import { CreateExerciseDto } from '../dto/ExerciseDto';

/**
 * * Method     GET
 * * Endpoint   /api/exercises
 * * Access     Private
 */
export const getExercises = asnycHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const exercises = await Exercise.find();

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

    const exercise = new Exercise(createExerciseDto);

    await exercise.save();

    res.status(201).json({ success: true, data: exercise });
  }
);
