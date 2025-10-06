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

  // Handle OPTIONS requests for CORS preflight
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', '*'); // Allow all origins for OPTIONS, then restrict for actual requests
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization');
      return res.sendStatus(200);
    }
    next();
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



// Trigger Vercel redeploy


// Forçando um novo deploy para limpar o cache do Vercel

