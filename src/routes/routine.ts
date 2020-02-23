import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getRoutines,
  createRoutine,
  updateProgress,
  deleteRoutine
} from '../controllers/RoutineController';

const routineRouter = Router();

routineRouter.get('/', protect, getRoutines);
routineRouter.post('/', protect, createRoutine);
routineRouter.delete('/:routineId', protect, deleteRoutine);
routineRouter.post('/:routineId/:exerciseId/progress', protect, updateProgress);

export default routineRouter;
