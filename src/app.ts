import express, { Application } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';

import connect from './config/db';
import exerciseRouter from './routes/exercise';
import { ErorrHandler } from './middleware/error';
import authRouter from './routes/auth';
import routineRouter from './routes/routine';
import logRouter from './routes/logs';

config();

const app: Application = express();
const port: number = (process.env.PORT as any) || 5000;

connect(process.env.MONGO_URL as any);

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/exercises', exerciseRouter);
app.use('/api/auth', authRouter);
app.use('/api/routines', routineRouter);
app.use('/api/logs', logRouter);

app.use(ErorrHandler);

app.listen(port, () => {
  console.log(`Server running on ${port} in ${process.env.NODE_ENV} mode`);
});
