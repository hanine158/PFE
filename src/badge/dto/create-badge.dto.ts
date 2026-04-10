import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBadgeDto {
  @IsString()
  @IsNotEmpty()
  nom!: string;

  @IsString()
  @IsNotEmpty()
  icone!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  user!: number;
}