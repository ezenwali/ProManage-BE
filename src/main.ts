import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as passport from 'passport';
import * as PackageJson from '../package.json';
import { AppModule } from './app.module';
import { _session } from './common/app';
import { environmentVariables } from './config/env.variables';
import { restrictUrl } from './middlewares/restrictUrls';

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
    .addCookieAuth('session', { type: 'apiKey', in: 'cookie' })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(environmentVariables.port);
}
bootstrap();
