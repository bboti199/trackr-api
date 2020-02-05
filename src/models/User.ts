import mongoose, { Schema } from 'mongoose';
import { IUser } from '../interfaces/user';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    username: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
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
  if (!this.isModified('password')) {
    next();
  }

  this.password = await hash(this.password, 10);

  if (this.avatar != null) {
    next();
  }

  this.avatar = `https://eu.ui-avatars.com/api/?name=${this.firstName}+${this.lastName}`;
});

UserSchema.methods.checkPassword = async function(givenPass: string) {
  return await compare(givenPass, this.password);
};

UserSchema.methods.getSignedJWT = function() {
  return sign(
    {
      id: this._id,
      role: this.role
    },
    process.env.JWT_SECRET as any,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

export default mongoose.model<IUser>('User', UserSchema);
