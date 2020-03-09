import mongoose, { Schema } from 'mongoose';
import { IRoutine } from '../interfaces/routine';
import RoutineDataSchema from './RoutineData';
import ProgressInfo from './ProgressInfo';

const RoutineSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    routineData: [RoutineDataSchema]
  },
  { timestamps: true }
);

/*RoutineSchema.pre('remove', function(next) {
  ProgressInfo.remove({ routine: this._id }).exec();
  next();
});*/

export default mongoose.model<IRoutine>('Routine', RoutineSchema);
