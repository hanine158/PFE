import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSchemaDto {
  @IsString()
  @IsNotEmpty()
  titre!: string;

  @IsString()
  @IsNotEmpty()
  contenu!: string;

  @IsString()
  @IsOptional()
  imageUrl?: string | null;
}