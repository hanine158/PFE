import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get()
  async getLeaderboard(@Query('filter') filter: string) {
    return await this.leaderboardService.getLeaderboard(filter || 'all');
  }
}