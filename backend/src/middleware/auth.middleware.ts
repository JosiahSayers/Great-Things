import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../util/environment';
import { UserJWT } from '../types/jwt';

export const isAuthorized = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authCookie = req.cookies.Authorization;
  if (!authCookie) {
    return res.sendStatus(401);
  }
  try {
    const encodedJWT = authCookie.split(' ')[1];
    const userJWT = <UserJWT>jwt.verify(encodedJWT, JWT_SECRET);
    
    if (isJwtExpired(userJWT)) {
      return res.status(401).send({ msg: 'JWT has expired' });
    }

    if (!isValidResource(req, userJWT)) {
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
};

function isJwtExpired(userJwt: UserJWT): boolean {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  return currentTime > userJwt.exp;
}

function isValidResource(req: Request, userJWT: UserJWT): boolean {
  const requestedUserId = req.params.userid;
  return !requestedUserId || requestedUserId === userJWT.id;
}
