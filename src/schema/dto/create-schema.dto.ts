import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateSchemaDto {
  @IsString()
  @IsNotEmpty()
  titre!: string;

  @IsString()
  @IsNotEmpty()
  contenu!: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsNumber()
  analyseReId?: number;
}