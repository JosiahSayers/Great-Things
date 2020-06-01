import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';

export const logRequest = (req: Request, res: Response, next: NextFunction): Response | void => {
  logger.debug({
    method: `${req.method}`,
    path: `${req.originalUrl}`
  });
  return next();
};
