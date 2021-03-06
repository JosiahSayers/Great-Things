import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { JWT_SECRET } from '../util/environment';
import { UserJWT } from '../types/jwt';
import { GreatThing } from '../models/Great-Thing';
import { logger, baseLogObject } from '../util/logger';

export const isAuthorized = (req: Request, res: Response, next: NextFunction): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.debug({
      msg: 'User sent a request without an Authorization header',
      transactionId: <string>req.headers['transaction-id']
    });
    return res.sendStatus(401);
  }
  try {
    const encodedJWT = authHeader.split(' ')[1];
    const userJWT = <UserJWT>jwt.verify(encodedJWT, JWT_SECRET);

    req.jwt = userJWT;

    return next();
  } catch (e) {
    logger.error({
      msg: 'Error encountered in the JWT Authorization flow',
      error: e,
      transactionId: <string>req.headers['transaction-id']
    });
    if (e instanceof TokenExpiredError) {
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
    return sendAndLog('Current user is not authorized to access this resource', requestedUserId, req, res);
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
      return sendAndLog('Current user is not authorized to access this resource', requestedGreatThing._id, req, res);
    }
  } catch (e) {
    logger.error({
      msg: 'Error encountered in doesUserOwnGreatThing middleware',
      error: e,
      ...baseLogObject(req)
    });
    return res.status(500);
  }
};

const sendAndLog = (msg: string, requestedResource: string, req: Request, res: Response): void => {
  logger.debug({
    msg,
    requestedResource,
    ...baseLogObject(req)
  });
  res.status(401).send({ msg });
};
