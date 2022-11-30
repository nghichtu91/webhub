import path from 'path';

// Environment config variables
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = +process.env.PORT || 4000;
export const LISTEN_ON = process.env.LISTEN_ON || '0.0.0.0';
export const WORKING_DIR = path.resolve(__dirname, '../../../../'); // Notice: Pay attention to this variable when restructuring the project

// Basic auth (Cookies configuration)
export const sessionSecret = process.env.SESSION_SECRET;
export const sessionMaxAge = process.env.SESSION_MAX_AGE;

// JSON Web Token
export const jwtSecretKey = process.env.JWT_SECRET_KEY;
export const jwtTokenExpiration = process.env.JWT_TOKEN_EXPIRATION;
export const jwtRefreshTokenExpiration =
  process.env.JWT_REFRESH_TOKEN_EXPIRATION;
