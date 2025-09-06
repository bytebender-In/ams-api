import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { DatabaseService } from './core/database/database.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Proxy /documents requests to Nextra service
  app.use(
    '/documents',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      pathRewrite: {
        '^/documents': '/documents',
      },
    }),
  );

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Adaptive Management System API')
    .setDescription('API documentation for the Adaptive Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'AMS API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      persistAuthorization: true,
      filter: true,
      showRequestDuration: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Get DatabaseService instance
  const databaseService = app.get(DatabaseService);

  // Simple /health route for health check (like Render, Docker, etc.)
  app.getHttpAdapter().get('/health', async (_, res: Response) => {
    const dbStatus = await databaseService.checkConnection();
    res.status(200).json({
      status: 'OK',
      database: dbStatus ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString(),
    });
  });

  // Serve markdown and MDX documents
  app
    .getHttpAdapter()
    .get('/document/:filename', async (req: Request, res: Response) => {
      const filename = req.params.filename;
      const filePath = join(__dirname, '..', 'docs', filename);

      try {
        const fileContent = await import('fs/promises').then((fs) =>
          fs.readFile(filePath, 'utf-8'),
        );
        res.setHeader('Content-Type', 'text/markdown');
        res.send(fileContent);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        res.status(404).json({ error: 'Document not found' });
      }
    });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
