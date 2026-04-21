import { IsEnum, IsOptional, IsString } from 'class-validator';
import {
  NotificationPriority,
  NotificationType,
} from '../entities/admin-notification.entity';

export class CreateAdminNotificationDto {
  @IsString()
  title!: string;

  @IsString()
  message!: string;

  @IsEnum(NotificationType)
  type!: NotificationType;

  @IsEnum(NotificationPriority)
  priority!: NotificationPriority;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  actionUrl?: string;
}