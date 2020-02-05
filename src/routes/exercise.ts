import { Router } from 'express';
import { getExercises, addExercise } from '../controllers/ExerciseController';

const exerciseRouter = Router();

exerciseRouter.get('/', getExercises);
exerciseRouter.post('/', addExercise);

export default exerciseRouter;
