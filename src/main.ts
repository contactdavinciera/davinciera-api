import { NestFactory } from '@nestjs/core';
import * as express from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: ['https://davinciera-official.pages.dev', 'https://davinciera.pages.dev', 'http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });

  // For Stripe webhooks, we need the raw body. We use a conditional middleware.
  app.use((req, res, next) => {
    if (req.originalUrl === '/stripe/webhook') {
      express.raw({ type: '*/*' })(req, res, next);
    } else {
      express.json()(req, res, next);
    }
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

