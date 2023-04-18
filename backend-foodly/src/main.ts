import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { validatorConfig } from './shared/config/validation.config';
import { swaggerConfig } from './shared/config/swagger.config';
import { corsOptions } from './shared/config/cors.config';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: corsOptions,
  });

  /* ==== Setting Validation ==== */
  app.useGlobalPipes(new ValidationPipe(validatorConfig));

  /* ==== Setting Port ==== */
  const configService = app.get(ConfigService);
  const APP_PORT = configService.get<number>('PORT') || 8080;

  /* ==== Setting Websocket ==== */
  app.useWebSocketAdapter(new WsAdapter(app));

  /* ==== Setting Swagger ==== */
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(APP_PORT, '0.0.0.0');
}

bootstrap();
