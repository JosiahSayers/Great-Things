import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { PORT, MONGO_CONNECTION_STRING, GCP_ID, GCP_USER_PHOTOS } from './util/environment';
import authController from './controllers/auth.controller';
import greatThingsController from './controllers/great-things.controller';
import mongoose from 'mongoose';
import { logRequest } from './middleware/logger.middleware';
import { validateHeaders } from './middleware/validation.middleware';
import { isAuthorized, isCurrentUser } from './middleware/auth.middleware';
import { logger } from './util/logger';
import fileUpload from 'express-fileupload';
import { Storage } from '@google-cloud/storage';

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

const photoBucket = new Storage({ 
  keyFilename: './gcp-key.json',
  projectId: GCP_ID 
}).bucket(GCP_USER_PHOTOS);

const injectStorageBucket = (req: Request, res: Response, next: NextFunction): void => { 
  req.photoStorage = photoBucket;
  next();
};

app.set('port', PORT || 3000);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use(fileUpload());
app.use(bodyParser.urlencoded());

app.use('/v1/auth', logRequest, validateHeaders, authController);
app.use('/v1/users/:userid/great-things', logRequest, injectStorageBucket, validateHeaders, isAuthorized, isCurrentUser, greatThingsController);

export default app;
