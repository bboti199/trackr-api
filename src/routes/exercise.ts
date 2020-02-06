import { Router } from 'express';
import {
  getExercises,
  addExercise,
  getExercisesGrouped,
  deleteExercise
} from '../controllers/ExerciseController';
import { protect } from '../middleware/auth';

const exerciseRouter = Router();

exerciseRouter.get('/', protect, getExercises);
exerciseRouter.get('/grouped', protect, getExercisesGrouped);
exerciseRouter.post('/', protect, addExercise);
exerciseRouter.delete('/:id', protect, deleteExercise);

export default exerciseRouter;
