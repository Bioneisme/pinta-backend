import dotenv from "dotenv";
dotenv.config();

// const NODE_ENV: string = process.env.NODE_ENV || 'development';

const DEFAULT_PG_URL: string = 'postgres://postgres:root@postgres:5432/postgres';
const DEFAULT_SERVER_PORT: number = 5000;
const DEFAULT_CLIENT_URL: string = 'localhost';
const DEFAULT_JWT_ACCESS_SECRET: string = 'someSecretKey33485';
const DEFAULT_JWT_REFRESH_SECRET: string = 'someSecretKey33486';
const DEFAULT_REDIS_HOST: string = 'redis';
const DEFAULT_REDIS_PORT: string = '6379'
const DEFAULT_REDIS_PASSWORD: string = '';
const DEFAULT_EXPIRY_TIME: number = 5 * 60;

export const DB_URI: string = process.env.DB_URI || DEFAULT_PG_URL;
export const SERVER_PORT: number = +(process.env.SERVER_PORT || DEFAULT_SERVER_PORT);
export const JWT_ACCESS_SECRET: string = process.env.JWT_ACCESS_SECRET || DEFAULT_JWT_ACCESS_SECRET;
export const JWT_REFRESH_SECRET: string = process.env.JWT_REFRESH_SECRET || DEFAULT_JWT_REFRESH_SECRET;
export const CLIENT_URL: string = process.env.CLIENT_URL || DEFAULT_CLIENT_URL;
export const BOT_TOKEN: string = process.env.BOT_TOKEN as string;
export const CHAT_ID: string = process.env.CHAT_ID as string;
export const LOGS_CHAT_ID: string = process.env.LOGS_CHAT_ID as string;
export const EXPIRY_TIME: number = +(process.env.EXPIRY_TIME || DEFAULT_EXPIRY_TIME);
const REDIS_HOST: string = process.env.REDIS_HOST || DEFAULT_REDIS_HOST;
const REDIS_PORT: string = process.env.REDIS_PORT || DEFAULT_REDIS_PORT;
const REDIS_PASSWORD: string = process.env.REDIS_PASSWORD || DEFAULT_REDIS_PASSWORD;
const AWS_BUCKET_NAME: string = process.env.AWS_BUCKET_NAME as string;
const AWS_BUCKET_REGION: string = process.env.AWS_BUCKET_REGION as string;
const AWS_ACCESS_KEY_ID: string = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_ACCESS_KEY_SECRET: string = process.env.AWS_ACCESS_KEY_SECRET as string;

export const REDIS = {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
}

export const AWS = {
    region: AWS_BUCKET_REGION,
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_ACCESS_KEY_SECRET,
    bucketName: AWS_BUCKET_NAME
}