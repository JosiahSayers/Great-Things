import { UserJWT } from './jwt';
import { GreatThingDocument } from '../models/Great-Thing';
import { Bucket } from '@google-cloud/storage';
import { LanguageServiceClient } from '@google-cloud/language';

declare module 'express-serve-static-core' {
  interface Request {
    jwt?: UserJWT;
    greatThing?: GreatThingDocument;
    photoStorage?: Bucket;

    languageClient?: LanguageServiceClient;
  }
}
