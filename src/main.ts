import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './modules/app/app.module';
import { configSession, appGlobalConfig, devConfig } from '@app/config';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

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

  app.listen(process.env.PORT || 3000, '0.0.0.0');
}

bootstrap();
