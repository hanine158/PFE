import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateTeacherNotificationDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsNumber()
  userId!: number;
}