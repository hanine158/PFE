import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateAdminSettingsDto {
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  newUserAlert?: boolean;

  @IsOptional()
  @IsBoolean()
  courseAlert?: boolean;

  @IsOptional()
  @IsBoolean()
  paymentAlert?: boolean;

  @IsOptional()
  @IsBoolean()
  twoFactor?: boolean;

  @IsOptional()
  @IsString()
  sessionTimeout?: string;

  @IsOptional()
  @IsBoolean()
  loginAlerts?: boolean;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsBoolean()
  compactMode?: boolean;

  @IsOptional()
  @IsString()
  smtpServer?: string;

  @IsOptional()
  @IsString()
  smtpPort?: string;

  @IsOptional()
  @IsString()
  senderEmail?: string;

  @IsOptional()
  @IsString()
  senderPassword?: string;

  @IsOptional()
  @IsString()
  backupFrequency?: string;

  @IsOptional()
  @IsString()
  lastBackup?: string;

  @IsOptional()
  @IsString()
  backupSize?: string;
}