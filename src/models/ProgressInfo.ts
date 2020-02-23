import mongoose, { Schema } from 'mongoose';
import { IProgressInfo } from '../interfaces/progressInfo';

const ProgressInfoSchema: Schema = new Schema(
  {
    weight: {
      type: Number,
      required: true
    },
    sets: {
      type: Number,
      required: true
    },
    reps: {
      type: Number,
      required: true
    },
    routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine' },
    exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }
  },
  { timestamps: true }
);

export default mongoose.model<IProgressInfo>(
  'ProgressInfo',
  ProgressInfoSchema
);
