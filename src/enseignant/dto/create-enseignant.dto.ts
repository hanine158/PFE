import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateEnseignantDto {
  @IsNotEmpty()
  nom: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}