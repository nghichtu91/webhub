import path from 'path';
import * as dotenv from 'dotenv';
// setup env

dotenv.config({ path: path.resolve(process.cwd(), '.env'), override: true });

import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';
import { configSession, appGlobalConfig, devConfig } from '@app/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import { Logger } from '@nestjs/common';
import { PORT, LISTEN_ON } from './config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  devConfig(app);
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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  configSession(app);

  app.listen(PORT, LISTEN_ON, () => {
    Logger.log(`Nest listening on http://${LISTEN_ON}:${PORT}`, 'Bootstrap');
  });
}

bootstrap();
