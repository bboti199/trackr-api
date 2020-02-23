import { Document } from 'mongoose';
import { IRoutine } from './routine';
import { IUser } from './user';

export interface IWorkoutLog extends Document {
  routine: IRoutine;
  user: IUser;
  completed: boolean;
}
