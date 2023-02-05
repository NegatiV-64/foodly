import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: false,
      allowedHeaders: ['Content-Type', 'Authorization'],
    }
  });

  const configService = app.get(ConfigService);
  const APP_PORT = configService.get<number>('PORT') || 8080;
  
  await app.listen(APP_PORT);
}
bootstrap();
