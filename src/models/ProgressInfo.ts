import mongoose, { Schema } from 'mongoose';

const ProgressInfoSchema: Schema = new Schema(
  {
    weight: {
      type: [Number]
    },
    sets: {
      type: Number,
      required: true
    },
    reps: {
      type: [Number],
      required: true
    }
  },
  { timestamps: true }
);

export default ProgressInfoSchema;
