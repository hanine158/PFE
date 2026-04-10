// src/cours/dto/create-cour.dto.ts
import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";
import { Type } from "class-transformer";

export class CreateCourDto {
  @IsString()
  @IsNotEmpty()
  titre!: string;

  @IsNumber()
  @Type(() => Number)
  user!: number;
  
  @IsOptional()
  @IsNumber()
  pdfId?: number;
}