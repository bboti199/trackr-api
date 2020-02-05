import { Document } from 'mongoose';

export enum ExerciseType {
  compound = 'compound',
  isolation = 'isolation'
}

export interface IExercise extends Document {
  name: string;
  bodyPart: string;
  type: ExerciseType;
  owner: string | null;
}
