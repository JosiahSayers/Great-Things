import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../util/environment';
import { UserJWT } from '../types/jwt';

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const authCookie = req.cookies.Authorization;
  if (!authCookie) {
    return res.sendStatus(401);
  }
  try {
    const encodedJWT = authCookie.split(' ')[1];
    const userJWT = <UserJWT>jwt.verify(encodedJWT, JWT_SECRET);
    const requestedUserId = req.params.userid;

    if (requestedUserId && requestedUserId !== userJWT.id) {
      return res.status(401).send({ msg: 'Current user is not authorized to access this resource' });
    }

    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res.status(401).send({ msg: 'Token Expired' });
    } else {
      return res.sendStatus(500);
    }
  }
}