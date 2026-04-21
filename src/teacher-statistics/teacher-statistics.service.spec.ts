import { Test, TestingModule } from '@nestjs/testing';
import { TeacherStatisticsService } from './teacher-statistics.service';

describe('TeacherStatisticsService', () => {
  let service: TeacherStatisticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherStatisticsService],
    }).compile();

    service = module.get<TeacherStatisticsService>(TeacherStatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
