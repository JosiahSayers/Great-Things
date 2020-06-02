import { Request, Response, NextFunction } from 'express';
import { GreatThingRequest } from '../types/great-things.request';
import { baseLogObject } from '../util/logger';

export const validatePicture = (req: Request, res: Response, next: NextFunction): Response | void => {
  const greatThingReq = <GreatThingRequest>req.body;
  if (greatThingReq.picture) {
    const pic = greatThingReq.picture;
    if (!pic.format || !pic.height || !pic.width || !pic.href) {
      res.status(400).send({
        msg: 'User tried to submit a Great Thing with a picture object that doesn\'t match the schema',
        req: greatThingReq,
        ...baseLogObject(req)
      });
    }
  }
  return next();
};
