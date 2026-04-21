import { Test, TestingModule } from '@nestjs/testing';
import { TeacherNotificationsService } from './teacher-notifications.service';

describe('TeacherNotificationsService', () => {
  let service: TeacherNotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeacherNotificationsService],
    }).compile();

    service = module.get<TeacherNotificationsService>(TeacherNotificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
