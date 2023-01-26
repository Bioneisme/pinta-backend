import dotenv from "dotenv";
dotenv.config();

// const NODE_ENV: string = process.env.NODE_ENV || 'development';

export const DB_URI: string = process.env.DB_URI || 'postgres://postgres:root@postgres:5432/postgres';
export const SERVER_PORT: number = +(process.env.SERVER_PORT || 5000);
export const JWT_SECRET: string = process.env.JWT_SECRET || 'someSecretKey33485';
export const CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:3000';