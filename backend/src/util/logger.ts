import winston from "winston";
import { ENVIRONMENT } from './environment';

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console({
      level: ENVIRONMENT === "production" ? "error" : "debug"
    }),
    new winston.transports.File({ filename: "debug.log", level: "debug" })
  ]
};

const logger = winston.createLogger(options);

if (ENVIRONMENT !== "production") {
  logger.debug("Logging initialized at debug level");
}

export default logger;