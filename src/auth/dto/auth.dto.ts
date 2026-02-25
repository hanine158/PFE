import { IsEmail, IsOptional, IsString } from 'class-validator';

export class AuthDto {

  @IsOptional()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}