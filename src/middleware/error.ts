import { ErrorResponse } from '../utils/ErrorResponse';
import { Request, Response, NextFunction } from 'express';

export const ErorrHandler = (
  err: ErrorResponse,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = {
    ...err
  };

  error.message = err.message;

  console.log(err);

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal Server Error'
  });
};
