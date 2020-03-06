import asyncHander from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../utils/ErrorResponse';
import { firebaseApp } from '../firebase/firebase';
import User from '../models/User';

export const protect = asyncHander(
  async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Retrieve token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token is given, throw error
    if (!token) {
      return next(
        new ErrorResponse(401, 'Not authorized to access this resource')
      );
    }

    try {
      // Decode & verify firebase token
      const decoded = await firebaseApp.auth().verifyIdToken(token);


      // Find firebase user
      const userData = await firebaseApp.auth().getUser(decoded.uid);

      // Find user in local database
      let localUser = await User.findOne({
        fid: userData.uid
      });

      if (localUser) {
        req.user = localUser;
        return next();
      } else {
        // If user used social auth, add it to the database
        if (!localUser) {
          localUser = new User({
            avatar: userData.photoURL,
            username: userData.displayName,
            fid: userData.uid,
            email: userData.email
          });

          await localUser.save();
          req.user = localUser;

          return next();
        }
      }
    } catch (err) {
      return next(
        new ErrorResponse(401, 'Not authorized to access this resource')
      );
    }
  }
);
