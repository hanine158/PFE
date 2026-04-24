import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardController } from './leaderboard.controller';
import { LeaderboardService } from './leaderboard.service';
import { User } from '../user/entities/user.entity';
import { Cour } from '../cours/entities/cour.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cour])],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
  exports: [LeaderboardService],
})
export class LeaderboardModule {}