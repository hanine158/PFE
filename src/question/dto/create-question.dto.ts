import { IsNotEmpty, IsString, IsArray } from "class-validator";

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  texte!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsArray()
  @IsNotEmpty({ each: true })
  options!: string[];

  @IsString()
  @IsNotEmpty()
  reponse!: string;
}