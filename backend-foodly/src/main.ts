import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { validatorConfig } from './shared/config/validation.config';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './shared/config/swagger.config';
import { corsOptions } from './shared/config/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsOptions,
  });

  /* ==== Setting Validation ==== */
  app.useGlobalPipes(new ValidationPipe(validatorConfig));

  /* ==== Setting Port ==== */
  const configService = app.get(ConfigService);
  const APP_PORT = configService.get<number>('PORT') || 8080;

  /* ==== Swagger ====  */
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(APP_PORT);
}

bootstrap();
