import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from './core/database/prisma-client-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CustomValidationPipe } from './common/pipe/custom-validation.pipe';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { PrismaService } from './core/database/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');

  const config = new DocumentBuilder()
    .setTitle('AMS API')
    .setDescription('API documentation for Adaptive Management System')
    .setVersion('1.0')
    .addTag('User Management')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useLogger(['debug', 'error', 'fatal', 'log', 'verbose', 'warn']);

  // Get PrismaService instance
  const prismaService = app.get(PrismaService);

  // Simple /health route for health check (like Render, Docker, etc.)
  app.getHttpAdapter().get('/health', async (_, res) => {
    const dbStatus = await prismaService.checkConnection();
    res.json({
      status: 'OK',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString()
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
