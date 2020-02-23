import { Router } from 'express';
import {
  getLogs,
  addLog,
  deleteLog,
  updateLog,
  getCompletedWorkouts,
  getPendingWorkouts
} from '../controllers/WorkoutLogController';
import { protect } from '../middleware/auth';

const logRouter = Router();

logRouter.get('/', protect, getLogs);
logRouter.post('/', protect, addLog);
logRouter.delete('/:id', protect, deleteLog);
logRouter.patch('/:id', protect, updateLog);

logRouter.get('/completed', protect, getCompletedWorkouts);
logRouter.get('/pending', protect, getPendingWorkouts);

export default logRouter;
