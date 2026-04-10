import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

function normalizeOrigin(origin: string): string {
  return origin.replace(/\/$/, '');
}

function isLocalhostOrigin(origin: string): boolean {
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function resolveAllowedOrigins(): string[] {
  const envOrigins = [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS?.split(',') ?? []),
  ]
    .filter(Boolean)
    .map((origin) => normalizeOrigin(String(origin)));

  const defaults = [
    'https://mk-academy-dev.pages.dev',
    'https://mk-academy.netlify.app',
    'http://localhost',
    'https://localhost',
    'http://localhost:3000',
    'https://localhost:3000',
    'http://127.0.0.1:3000',
    'capacitor://localhost',
    'ionic://localhost',
  ];

  return Array.from(new Set([...defaults, ...envOrigins]));
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = resolveAllowedOrigins();
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (origin === 'null') return callback(null, true);

      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.includes(normalizedOrigin) || isLocalhostOrigin(normalizedOrigin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('MK Academy API')
    .setDescription('CEFR Learning Platform API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true
  }});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = Number(process.env.PORT) || 3001;
  const host = process.env.HOST || '0.0.0.0';

  await app.listen(port, host);
  console.log(`Backend is running on: http://${host}:${port}`);
  await app.listen(process.env.PORT || 3000);
}

bootstrap().catch((error) => {
  console.error('Application bootstrap failed:', error);
  process.exit(1);
});
