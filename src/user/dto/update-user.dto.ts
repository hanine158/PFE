import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsIn(['student', 'teacher', 'admin'])
  role?: string;

  @IsOptional()
  @IsInt()
  xp?: number;

  @IsOptional()
  @IsInt()
  level?: number;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsString()
  bio?: string | null;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  pushNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  newMessage?: boolean;

  @IsOptional()
  @IsBoolean()
  newCourse?: boolean;

  @IsOptional()
  @IsBoolean()
  systemUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  weeklyDigest?: boolean;

  @IsOptional()
  @IsBoolean()
  twoFactorAuth?: boolean;

  @IsOptional()
  @IsString()
  sessionTimeout?: string;

  @IsOptional()
  @IsBoolean()
  loginAlerts?: boolean;

  @IsOptional()
  @IsString()
  profileVisibility?: string;

  @IsOptional()
  @IsBoolean()
  showEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  showPhone?: boolean;

  @IsOptional()
  @IsBoolean()
  showCourses?: boolean;

  @IsOptional()
  specializations?: string[] | null;

  @IsOptional()
  @IsString()
  refreshToken?: string | null;
}