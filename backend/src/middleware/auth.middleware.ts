import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../util/environment';

export const isAuthorized = (req: Request, res: Response, next: NextFunction) => {
  const authCookie = req.cookies.Authorization;
  if (!authCookie) {
    return res.sendStatus(401);
  }
  try {
    const encodedJWT = authCookie.split(' ')[1];
    const userJWT = jwt.verify(encodedJWT, JWT_SECRET);
    console.log(userJWT);
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      return res.status(401).send({ msg: 'Token Expired' });
    } else {
      return res.sendStatus(500);
    }
  }
  return next();
}