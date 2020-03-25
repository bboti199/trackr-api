import { Document } from 'mongoose';

export interface IProgressInfo extends Document {
  weight: number;
  sets: number;
  reps: number;
  createdAt: Date;
}
