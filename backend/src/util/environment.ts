import dotenv from 'dotenv';
// import { ConfigOptions } from 'cloudinary';

dotenv.config({ path: '.env' });

export const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
export const PORT = process.env.port;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ENVIRONMENT = process.env.ENVIRONMENT;

export const GCP_ID = process.env.GOOGLE_CLOUD_PROJECT;

export const GCP_USER_PHOTOS = process.env.GCP_USER_PHOTOS;

export const GCP_PHOTO_URL_BASE = `https://storage.googleapis.com/${GCP_USER_PHOTOS}/`;
