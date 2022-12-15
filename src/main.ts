import path from 'path';
import * as dotenv from 'dotenv';

// setup env
dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '@modules/app/app.module';
import {
  configSession,
  appGlobalConfig,
  devConfig,
  prodConfig,
} from '@app/config';
import { useContainer } from 'class-validator';
import { Logger } from '@nestjs/common';
import { PORT, LISTEN_ON, NODE_ENV } from './config';
import winston, { createLogger, format } from 'winston';
import { WinstonModule } from 'nest-winston';
import express from 'express';

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

async function bootstrap() {
  const instance = createLogger({
    // options of Winston
    format: combine(label({ label: 'jxhub' }), timestamp(), myFormat),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  if (NODE_ENV === 'development') {
    devConfig(app);
  } else {
    prodConfig(app);
  }

  // devConfig(app);
  appGlobalConfig(app);

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // app.engine(
  //   'hbs',
  //   hbs({
  //     extname: 'hbs',
  //     defaultLayout: 'layout',
  //     partialsDir: join(__dirname, '..', 'views', 'partials'),
  //     layoutsDir: join(__dirname, '..', 'views', 'layouts'),
  //   }),
  // );

  // app.setViewEngine('hbs');
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  configSession(app);

  app.listen(PORT, LISTEN_ON, () => {
    Logger.log(`Nest listening on http://${LISTEN_ON}:${PORT}`, 'Bootstrap');
  });
}

bootstrap();
