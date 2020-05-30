import { Request, Response, NextFunction } from 'express';
import logger from '../util/logger';

export const validateHeaders = (req: Request, res: Response, next: NextFunction): Response | void => {
  for (let i = 0; i < requiredHeaders.length; i++) {
    const header = requiredHeaders[i];
    
    if (!req.headers[header] || req.headers[header].toString().trim() === '') {
      const errorMsg = generateMissingHeaderError(header);
      logger.debug(errorMsg);
      return res.status(400).send(errorMsg);
    }
  }
  return next();
};

const requiredHeaders = ['transaction-id'];

function generateMissingHeaderError(header: string): { name: string, developerMessage: string } {
  return {
    name: `Missing Header: ${header}`,
    developerMessage: `${header} is a required header. A valid value must be sent`
  };
}
