import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Badge } from 'src/badge/entities/badge.entity';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
   niveau: string;

   @IsNotEmpty()
   @IsNumber()
   xp: number;

   @IsNotEmpty()
   badges: Badge[];

   @IsString()
   @IsNotEmpty()
   @MinLength(6)
   password: string;

    @IsOptional()
  @IsString()
  refreshToken: string |null;
}