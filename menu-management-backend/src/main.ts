import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS for all origins
  app.enableCors({
    origin: 'http://localhost:3001, https://menu12.vercel.app', // Allow requests from your Next.js frontend
    credentials: true, // If you're using cookies or authentication
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific methods
    allowedHeaders: 'Content-Type, Authorization', // Allow specific headers
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
