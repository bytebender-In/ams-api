import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './core/database/prisma-client-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const config = new DocumentBuilder()
    .setTitle('AMS API')
    .setDescription('API documentation for Adaptive Management System')
    .setVersion('1.0')
    .addTag('User Management', 'Endpoints for managing users, roles, permissions')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Apply Prisma exception filter globally
  app.useGlobalFilters(new PrismaClientExceptionFilter());

  // Use global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('v1');

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application running at http://localhost:${process.env.PORT ?? 3000}/`);
}
bootstrap();
