import { Document } from 'mongoose';
import { IProgressInfo } from './progressInfo';

export interface IRoutineData extends Document {
  routine: string;
  exercise: string;
  progress: [IProgressInfo];
}
