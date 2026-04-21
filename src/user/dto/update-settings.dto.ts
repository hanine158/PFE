import {
  IsBoolean,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsObject()
  notifications?: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    newMessage?: boolean;
    newCourse?: boolean;
    systemUpdates?: boolean;
    weeklyDigest?: boolean;
  };

  @IsOptional()
  @IsObject()
  security?: {
    twoFactorAuth?: boolean;
    sessionTimeout?: string;
    loginAlerts?: boolean;
  };

  @IsOptional()
  @IsObject()
  privacy?: {
    profileVisibility?: string;
    showEmail?: boolean;
    showPhone?: boolean;
    showCourses?: boolean;
  };
}