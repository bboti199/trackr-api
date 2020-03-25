import { Router } from 'express';
import { protect } from '../middleware/auth';
import {
  getRoutines,
  createRoutine,
  updateProgress,
  deleteRoutine,
  updateRoutine,
  getRoutineById,
  getChartDataForRoutine
  // deleteProgressData,
  // updateProgressInfo
} from '../controllers/RoutineController';

const routineRouter = Router();

routineRouter.get('/', protect, getRoutines);
routineRouter.get('/:routineId', protect, getRoutineById);
routineRouter.post('/', protect, createRoutine);
routineRouter.delete('/:routineId', protect, deleteRoutine);
routineRouter.patch('/:routineId', protect, updateRoutine);

routineRouter.get(
  '/:routineId/progress/chart/:timePeriod',
  protect,
  getChartDataForRoutine
);
routineRouter.post('/:routineId/progress', protect, updateProgress);
// routineRouter.delete('/progress/:progressInfoId', protect, deleteProgressData);
// routineRouter.patch('/progress/:progressInfoId', protect, updateProgressInfo);

export default routineRouter;
