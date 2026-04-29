import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.get(PrismaService).enableShutdownHooks(app);

  const httpEnabled = (process.env.BOT_HTTP_ENABLED ?? 'true').toLowerCase();
  const shouldListen =
    httpEnabled !== 'false' && httpEnabled !== '0' && httpEnabled !== 'no';

  if (!shouldListen) {
    await app.init();
    return;
  }

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
}

void bootstrap();
