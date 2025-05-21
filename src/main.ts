import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './core/database/prisma-client-exception.filter';
import { ValidationPipe } from '@nestjs/common';
/**
 * Initializes and starts the NestJS application.
 * 
 * - Creates the app using the root AppModule.
 * - Configures Swagger for API documentation with:
 *    • Title: "AMS API"
 *    • Description: "API documentation for Adaptive Management System"
 *    • Version: "1.0"
 *    • Bearer token authentication support.
 * - Sets up Swagger UI available at the "/api" route.
 * - Starts the HTTP server listening on the port defined by
 *   the environment variable PORT or defaults to 3000.
 *  @author Vartik Anand
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.useGlobalFilters(new PrismaClientExceptionFilter())

  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
