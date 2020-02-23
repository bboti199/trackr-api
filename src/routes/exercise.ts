import { Router } from 'express';
import {
  getExercises,
  addExercise,
  getExercisesGrouped,
  deleteExercise,
  updateExercise,
  getCompoundExercises,
  getIsolationExercises
} from '../controllers/ExerciseController';
import { protect } from '../middleware/auth';

const exerciseRouter = Router();

exerciseRouter.get('/', protect, getExercises);
exerciseRouter.get('/grouped', protect, getExercisesGrouped);
exerciseRouter.get('/compound', protect, getCompoundExercises);
exerciseRouter.get('/isolation', protect, getIsolationExercises);
exerciseRouter.post('/', protect, addExercise);
exerciseRouter.delete('/:id', protect, deleteExercise);
exerciseRouter.patch('/:id', protect, updateExercise);

export default exerciseRouter;
