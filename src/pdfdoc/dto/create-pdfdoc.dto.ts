// src/pdfdoc/dto/create-pdfdoc.dto.ts
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreatePdfdocDto {
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @IsString()
  @IsNotEmpty()
  originalName!: string;

  @IsString()
  @IsNotEmpty()
  filePath!: string;

  @IsNumber()
  fileSize!: number;

  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @IsOptional()
  @IsNumber()
  coursId?: number;
}