import { Request, Response, NextFunction } from 'express';
import { logger } from '../util/logger';

export const logRequest = (req: Request, res: Response, next: NextFunction): Response | void => {
  logger.info({
    method: `${req.method}`,
    path: `${req.originalUrl}`,
    transactionId: req.headers['transaction-id']
  });
  return next();
};
