import winston from 'winston';
import { ENVIRONMENT } from './environment';
import { Request } from 'express';

const prettyJson = winston.format.printf((info) => {
  info.message = JSON.stringify({ log: info.message, timestamp: info.timestamp }, null, 4);
  return `${info.level}: ${info.message}`;
});

export const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.prettyPrint(),
    winston.format.splat(),
    winston.format.simple(),
    winston.format.timestamp(),
    prettyJson
  ),
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (ENVIRONMENT !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export const baseLogObject = (req: Request): Record<string, unknown> => {
  return {
    transactionId: req.headers['transaction-id'],
    user: {
      email: req.jwt.email,
      id: req.jwt.id,
      profile: {
        name: req.jwt.name
      }
    }
  };
};
