import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user';
import * as crypto from 'crypto';

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },
    fid: {
      type: String,
      required: true,
      unique: true
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function(this: IUser, next) {
  if (this.avatar) {
    return next();
  }

  const hash = crypto
    .createHash('md5')
    .update(new Date().toString())
    .digest('hex');

  this.avatar = `http://www.gravatar.com/avatar/${hash}?d=identicon`;
});

export default mongoose.model<IUser>('User', UserSchema);
