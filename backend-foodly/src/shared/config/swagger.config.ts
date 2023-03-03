import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Foodly REST API')
    .setDescription('This is documentation for Foodly Application')
    .setVersion('0.0.5')
    .addBearerAuth()
    .build();