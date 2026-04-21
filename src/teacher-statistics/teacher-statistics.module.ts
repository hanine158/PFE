import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherStatisticsController } from './teacher-statistics.controller';
import { TeacherStatisticsService } from './teacher-statistics.service';
import { User } from '../user/entities/user.entity';
import { Cour } from '../cours/entities/cour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cour])],
  controllers: [TeacherStatisticsController],
  providers: [TeacherStatisticsService],
})
export class TeacherStatisticsModule {}