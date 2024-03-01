import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { environmentVariables } from './config/env.variables';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as PackageJson from '../package.json';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { restrictUrl } from './middlewares/restrictUrls';
import { _session } from './common/app';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: environmentVariables.origins,
    credentials: true,
  });

  app.use(restrictUrl);

  app.use(_session);

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle(PackageJson.name)
    .setDescription('Pro-manage BE')
    .setVersion(PackageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(environmentVariables.port);
}
bootstrap();
