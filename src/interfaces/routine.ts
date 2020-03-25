import { Document } from 'mongoose';
import { IRoutineData } from './routineData';

export interface IRoutine extends Document {
  name: string;
  description?: string;
  owner: string;
  routineData: [IRoutineData];
}

export enum TimePeriodInfo {
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all'
}
