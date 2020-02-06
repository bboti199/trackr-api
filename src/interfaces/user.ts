import { Document } from 'mongoose';

export enum UserRoles {
  user = 'user',
  admin = 'admin'
}

export interface IUser extends Document {
  fid: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar: string;
  role: UserRoles;
}
