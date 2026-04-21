import { Module } from '@nestjs/common';
import { TeacherNotificationsService } from './teacher-notifications.service';
import { TeacherNotificationsController } from './teacher-notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherNotification } from './entities/teacher-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherNotification])],
  controllers: [TeacherNotificationsController],
  providers: [TeacherNotificationsService],
})
export class TeacherNotificationsModule {}