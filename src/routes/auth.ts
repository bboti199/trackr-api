import { Router } from 'express';
import { register } from '../controllers/AuthController';

const authRouter = Router();

authRouter.post('/register', register);

export default authRouter;
