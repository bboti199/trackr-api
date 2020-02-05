import mongoose, { Schema } from 'mongoose';
import { IExercise } from '../interfaces/exercise';

const ExerciseSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    bodyPart: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['compound', 'isolation'],
      required: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model<IExercise>('Exercise', ExerciseSchema);
