import mongoose, { Schema } from 'mongoose';
import { IWorkoutLog } from '../interfaces/workoutLog';

const WorkoutLogSchema = new Schema(
  {
    workout: {
      type: Schema.Types.ObjectId,
      ref: 'Routine',
      required: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    completed: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model<IWorkoutLog>('WorkoutLog', WorkoutLogSchema);
