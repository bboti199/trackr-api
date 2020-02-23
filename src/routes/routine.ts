import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getRoutines,
  createRoutine,
  updateProgress,
  deleteRoutine,
  updateRoutine,
  getRoutineById,
  deleteProgressData,
  updateProgressInfo
} from '../controllers/RoutineController';

const routineRouter = Router();

routineRouter.get('/', protect, getRoutines);
routineRouter.get('/:routineId', protect, getRoutineById);
routineRouter.post('/', protect, createRoutine);
routineRouter.delete('/:routineId', protect, deleteRoutine);
routineRouter.patch('/:routineId', protect, updateRoutine);

routineRouter.post('/:routineId/:exerciseId/progress', protect, updateProgress);
routineRouter.delete('/progress/:progressInfoId', protect, deleteProgressData);
routineRouter.patch('/progress/:progressInfoId', protect, updateProgressInfo);

export default routineRouter;
