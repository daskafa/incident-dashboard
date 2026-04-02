import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { winstonConfig } from './logger/winston.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonConfig,
  });
  
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  const port = process.env.PORT || 3001;
  await app.listen(port);
  winstonConfig.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();
