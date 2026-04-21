import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { TeacherStatisticsService } from './teacher-statistics.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('teacher/statistics')
export class TeacherStatisticsController {
  constructor(
    private readonly teacherStatisticsService: TeacherStatisticsService,
  ) {}

  @Get('me')
  async getMyStatistics(
    @Request() req: any,
    @Query('period') period: string,
  ) {
    return await this.teacherStatisticsService.getTeacherStatistics(
      req.user.id,
      period || 'month',
    );
  }
}