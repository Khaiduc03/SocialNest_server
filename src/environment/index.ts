import * as dotenv from 'dotenv';

// config use env
dotenv.config();

// environment
const NODE_ENV: string = process.env.NODE_ENV;
const PORT: number =  +process.env.PORT;
const HASH: number = +process.env.HASH;

// database
const POSTGRES_HOST: string = process.env.POSTGRES_HOST;
const POSTGRES_PORT: number = +process.env.POSTGRES_PORT;
const POSTGRES_USER: string = process.env.POSTGRES_USER;
const POSTGRES_PASSWORD: string = process.env.POSTGRES_PASSWORD;
const POSTGRES_DB: string = process.env.POSTGRES_DB;

// jwt
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION_TIME: string =
    process.env.ACCESS_TOKEN_EXPIRATION_TIME;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRATION_TIME: string =
    process.env.REFRESH_TOKEN_EXPIRATION_TIME;

// cloud
const CLOUD_NAME: string = process.env.CLOUD_NAME;
const API_KEY: string = process.env.API_KEY;
const API_SECRET: string = process.env.API_SECRET;

//how to log it
console.log(POSTGRES_DB);

export {
    NODE_ENV,
    PORT,
    HASH,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    ACCESS_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRATION_TIME,
    REFRESH_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRATION_TIME,
    CLOUD_NAME,
    API_KEY,
    API_SECRET,
};
