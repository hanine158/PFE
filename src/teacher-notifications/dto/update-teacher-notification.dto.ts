import { PartialType } from '@nestjs/mapped-types';
import { CreateTeacherNotificationDto } from './create-teacher-notification.dto';

export class UpdateTeacherNotificationDto extends PartialType(CreateTeacherNotificationDto) {}
