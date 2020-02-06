import { Router } from 'express';
import { register, getUserData } from '../controllers/AuthController';
import { protect } from '../middleware/auth';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.get('/data', protect, getUserData);

export default authRouter;
