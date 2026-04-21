import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { CoursService } from './cours.service';
import { CoursController } from './cours.controller';
import { Cour } from './entities/cour.entity';
import { User } from '../user/entities/user.entity';
import { Pdfdoc } from '../pdfdoc/entities/pdfdoc.entity';
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cour, User, Pdfdoc]),
    MulterModule.register({
      dest: './uploads/pdfs',
    }),
    AdminNotificationsModule,
  ],
  controllers: [CoursController],
  providers: [CoursService],
  exports: [CoursService],
})
export class CoursModule {}