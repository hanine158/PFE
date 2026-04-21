// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //  Créeation le dossier uploads/pdfs au démarrage
  const uploadDir = path.join(process.cwd(), 'uploads', 'pdfs');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`📁 Dossier créé: ${uploadDir}`);
  }
  
  // Autorisat votre frontend sur les ports (AJOUTER 3000)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3001', 'http://localhost:5173'],
          
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  await app.listen(3001);
  console.log('🚀 Backend démarré sur http://localhost:3001');
  console.log(`📁 Les PDFs seront stockés dans: ${uploadDir}`);
}
bootstrap();