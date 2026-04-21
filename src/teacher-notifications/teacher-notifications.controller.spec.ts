import { Test, TestingModule } from '@nestjs/testing';
import { TeacherNotificationsController } from './teacher-notifications.controller';
import { TeacherNotificationsService } from './teacher-notifications.service';

describe('TeacherNotificationsController', () => {
  let controller: TeacherNotificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherNotificationsController],
      providers: [TeacherNotificationsService],
    }).compile();

    controller = module.get<TeacherNotificationsController>(TeacherNotificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
