export class CreateProgressInfoDto {
  weight?: number;
  sets: number;
  reps: number;
  date?: Date;
}

export class CreateRoutineDataDto {
  exercise: string;
  progress: [CreateProgressInfoDto];
}

export class CreateRoutineDto {
  name: string;
  description?: string;
  routineData: [CreateRoutineDataDto];
}

export class UpdateProgressInfoDto {
  weight: number;
  sets: number;
  reps: number;
}

export class UpdateRoutineProgressDtoItem {
  exercise: string;
  progress: UpdateProgressInfoDto;
}

export class UpdateRoutineProgressDto {
  data: [UpdateRoutineProgressDtoItem];
}

export class UpdateRoutineDto {
  name?: string;
  description?: string;
}
