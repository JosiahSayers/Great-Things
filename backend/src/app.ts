import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { PORT, MONGO_CONNECTION_STRING } from './util/environment';

import authController from './controllers/auth';
import mongoose from 'mongoose';
import { logRequest } from './middleware/logger.middleware';
import { validateHeaders } from './middleware/validation.middleware';

const app = express();

mongoose.connect(MONGO_CONNECTION_STRING, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
  .then(() => console.log('Successfully connected to mongoDB'))
  .catch((err) => {
    console.log('ERROR connecting to mongoDB');
    console.log(err);
    process.exit();
  });

app.set('port', PORT || 3000);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use('/v1/auth', logRequest, validateHeaders, authController);

export default app;