import { Document } from 'mongoose';

export interface IProgressInfo extends Document {
  weight: number;
  sets: number;
  reps: number;
  routine: string;
  exercise: string;
}
