import { Controller, Get, Query } from '@nestjs/common';
import { TeacherStatisticsService } from './teacher-statistics.service';

@Controller('teacher/statistics')
export class TeacherStatisticsController {
  constructor(
    private readonly teacherStatisticsService: TeacherStatisticsService,
  ) {}

  @Get('me')
  async getMyStatistics(@Query('period') period: string) {
    const teacherId = 11; // temporaire : ton user teacher actuel

    return await this.teacherStatisticsService.getTeacherStatistics(
      teacherId,
      period || 'month',
    );
  }
}