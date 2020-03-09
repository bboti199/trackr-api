import mongoose, { Schema } from 'mongoose';
import ProgressInfoSchema from './ProgressInfo';

const RoutineDataSchema: Schema = new Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  progress: [ProgressInfoSchema]
});

export default RoutineDataSchema;
