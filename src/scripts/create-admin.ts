import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  
  console.log('🚀 Création de l\'administrateur...');
  await userService.createDefaultAdmin();
  
  await app.close();
  console.log('✅ Terminé !');
}

bootstrap();