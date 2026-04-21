import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../user/user.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const userService = app.get(UserService);

    console.log('🚀 Création de l\'administrateur...');
    await userService.createDefaultAdmin(); // Maintenant public

    console.log('✅ Admin créé avec succès !');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await app.close();
  }
}

bootstrap();