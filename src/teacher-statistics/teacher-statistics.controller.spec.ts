import { Test, TestingModule } from '@nestjs/testing';
import { TeacherStatisticsController } from './teacher-statistics.controller';
import { TeacherStatisticsService } from './teacher-statistics.service';

describe('TeacherStatisticsController', () => {
  let controller: TeacherStatisticsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherStatisticsController],
      providers: [TeacherStatisticsService],
    }).compile();

    controller = module.get<TeacherStatisticsController>(TeacherStatisticsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
