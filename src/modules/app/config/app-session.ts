import { NestExpressApplication } from '@nestjs/platform-express';

import session from 'express-session';
import parseDuration from 'parse-duration';
import passport from 'passport';
import flash = require('connect-flash');

export function configSession(app: NestExpressApplication) {
  app.use(
    session({
      resave: false,
      saveUninitialized: false,
      secret: 'hubweb',
      cookie: {
        secure: false, // if true only transmit cookie over https
        httpOnly: false, // if true prevent client side JS from reading the cookie
        maxAge: parseDuration('50', 'd'), // session max age in milliseconds. Please restart Redis server after change this value!
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());
}
