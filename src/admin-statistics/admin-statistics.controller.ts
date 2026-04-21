import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminStatisticsService } from './admin-statistics.service';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminStatisticsController {
  constructor(
    private readonly adminStatisticsService: AdminStatisticsService,
  ) {}

  @Get('statistics')
  async getStatistics(@Query('period') period: string) {
    return await this.adminStatisticsService.getStatistics(period);
  }
}