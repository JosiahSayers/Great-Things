import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../util/environment';
import { UserJWT } from '../types/jwt';
import { GreatThing } from '../models/Great-Thing';
import logger from '../util/logger';

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

    req.jwt = userJWT;

    return next();
  } catch (e) {
    if (e instanceof TokenExpiredError) {
      logger.error(e);
      return res.status(401).send({ msg: 'Token Expired' });
    } else {
      return res.sendStatus(500);
    }
  }
};

export const isCurrentUser = (req: Request, res: Response, next: NextFunction): Response | void => {
  const requestedUserId = req.params.userid;
  if (!requestedUserId || requestedUserId === req.jwt.id) {
    return next();
  } else {
    return res.status(401).send({ msg: 'Current user is not authorized to access this resource' });
  }
};

export const doesUserOwnGreatThing = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const requestedGreatThing = await GreatThing.findById(req.params.greatThingId);
    const currentUserId = req.jwt.id;

    if (!requestedGreatThing || !currentUserId) {
      return res.sendStatus(404);
    } else if (requestedGreatThing.ownerId === currentUserId) {
      req.greatThing = requestedGreatThing;
      return next();
    } else {
      return res.status(401).send({ msg: 'Current user is not authorized to access this resource' });
    }
  } catch (e) {
    logger.error(e);
    return res.status(500);
  }
};

function isJwtExpired(userJwt: UserJWT): boolean {
  const currentTime = Math.floor(new Date().getTime() / 1000);
  return currentTime > userJwt.exp;
}
