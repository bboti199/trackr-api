import mongoose, { Schema } from 'mongoose';

const RoutineDataSchema: Schema = new Schema({
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  progress: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProgressInfo' }]
});

export default RoutineDataSchema;
