import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCourDto {
  @IsNotEmpty()
  @IsString()
  titre!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  price?: number;

  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  userId!: number;

  @IsOptional()
  @IsString()
  status?: string;
}