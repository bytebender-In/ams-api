import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaClientExceptionFilter } from './core/database/prisma-client-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CustomValidationPipe } from './common/pipe/custom-validation.pipe';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { PrismaService } from './core/database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  }));

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('AMS API')
    .setDescription('The AMS API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Get PrismaService instance
  const prismaService = app.get(PrismaService);

  // Simple /health route for health check (like Render, Docker, etc.)
  app.getHttpAdapter().get('/health', async (_, res) => {
    const dbStatus = await prismaService.checkConnection();
    res.json({
      status: 'OK',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
