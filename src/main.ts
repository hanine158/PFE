import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Validation global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ⚡️ تفعيل CORS باش frontend يشوف backend
  app.enableCors({
    origin: "http://localhost:5173", // رابط الـ React frontend
    credentials: true,               // لو حبيت ترسل كوكيز
  });

 const port = process.env.PORT ?? 3001; // بدل 3000 الى 3001
await app.listen(port);
console.log(`Server running on http://localhost:${port}`);
}
bootstrap();