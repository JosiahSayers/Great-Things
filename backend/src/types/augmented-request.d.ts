import { UserJWT } from './jwt';
import { GreatThingDocument } from '../models/Great-Thing';

declare module 'express-serve-static-core' {
  interface Request {
    jwt?: UserJWT;
    greatThing?: GreatThingDocument;
  }
}