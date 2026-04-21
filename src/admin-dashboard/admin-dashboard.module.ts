import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { User } from '../user/entities/user.entity';
import { Cour } from '../cours/entities/cour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cour])],
  providers: [AdminDashboardService],
  controllers: [AdminDashboardController],
})
export class AdminDashboardModule {}