import asnycHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { runValidation } from '../utils/runValidation';
import { RegisterUserSchema } from '../validation/UserSchema';
import { ErrorResponse } from '../utils/ErrorResponse';
import { CreateUserDto } from '../dto/UserDto';
import User from '../models/User';

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

    let user = await User.findOne({ email: createUserDto.email });

    if (user) {
      return next(new ErrorResponse(400, 'User already exists'));
    }

    user = new User(createUserDto);

    await user.save();

    res.status(201).json({ success: true, data: user });
  }
);
