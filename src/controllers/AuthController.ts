import asnycHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { runValidation } from '../utils/runValidation';
import { RegisterUserSchema } from '../validation/UserSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import { CreateUserDto } from '../dto/UserDto';
import User from '../models/User';
import { firebaseApp } from '../firebase/firebase';
import { IUser } from '../interfaces/user';

/**
 * * Method     POST
 * * Endpoint   /api/auth/register
 * * Access     Public
 */
export const register = asnycHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validationError = runValidation(RegisterUserSchema, req.body);

    if (validationError) {
      return next(new ErrorResponse(400, validationError));
    }

    const createUserDto: CreateUserDto = req.body;

    let user = await User.findOne({ fid: createUserDto.fid });

    if (user) {
      return next(new ErrorResponse(400, 'User already registered'));
    }

    const firebaseUser = await firebaseApp.auth().getUser(createUserDto.fid);

    if (!firebaseUser.email) {
      return next(new ErrorResponse(403, 'Can not register user'));
    }

    user = new User({
      username: createUserDto.username,
      email: firebaseUser.email,
      fid: createUserDto.fid,
      avatar: firebaseUser.photoURL
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: user
    });
  }
);

export const getUserData = asnycHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ fid: (req.user as IUser).fid });

    res.status(200).json({
      success: true,
      data: user
    });
  }
);
