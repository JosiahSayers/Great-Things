import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { PORT, MONGO_CONNECTION_STRING } from './util/environment';
import authController from './controllers/auth.controller';
import greatThingsController from './controllers/great-things.controller';
import mongoose from 'mongoose';
import { logRequest } from './middleware/logger.middleware';
import { validateHeaders } from './middleware/validation.middleware';
import { isAuthorized, isCurrentUser } from './middleware/auth.middleware';
import { logger } from './util/logger';

const app = express();

mongoose.connect(MONGO_CONNECTION_STRING, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true ,
    useFindAndModify: false
  })
  .then(() => logger.info('Successfully connected to mongoDB'))
  .catch((err) => {
    logger.error({
      msg: 'ERROR connecting to mongoDB, exiting process...',
      error: err
    });
    process.exit();
  });

app.set('port', PORT || 3000);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/v1/auth', logRequest, validateHeaders, authController);
app.use('/v1/users/:userid/great-things', logRequest, validateHeaders, isAuthorized, isCurrentUser, greatThingsController);

export default app;
