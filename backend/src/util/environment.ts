import dotenv from 'dotenv';
// import { ConfigOptions } from 'cloudinary';

dotenv.config({ path: '.env' });

export const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
export const PORT = process.env.port;
export const JWT_SECRET = process.env.JWT_SECRET;
export const ENVIRONMENT = process.env.ENVIRONMENT;

export const CLOUDINARY_CONIFG = JSON.parse(process.env.CLOUDINARY_CONFIG);
