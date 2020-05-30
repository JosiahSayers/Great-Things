import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  logger.debug({
    message: `${req.method} ${req.path}`,
    time: new Date().getTime()
  });
  return next();
}