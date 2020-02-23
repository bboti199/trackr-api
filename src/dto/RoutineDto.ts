export class CreateProgressInfoDto {
  weight: number;
  sets: number;
  reps: number;
  date: Date;
}

export class CreateRoutineDataDto {
  exercise: string;
  progressInfo?: [CreateProgressInfoDto];
}

export class CreateRoutineDto {
  name: string;
  description?: string;
  routineData: [CreateRoutineDataDto];
}
