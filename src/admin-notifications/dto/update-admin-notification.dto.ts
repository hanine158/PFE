import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminNotificationDto } from './create-admin-notification.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { NotificationStatus } from '../entities/admin-notification.entity';

export class UpdateAdminNotificationDto extends PartialType(CreateAdminNotificationDto) {
  @IsOptional()
  @IsEnum(NotificationStatus)
  status?: NotificationStatus;
}