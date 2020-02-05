import { ExerciseType } from '../interfaces/exercise';

export class CreateExerciseDto {
  name: string;
  bodyPart: string;
  type: ExerciseType;
}
