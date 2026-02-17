import { Type } from "class-transformer";
import { ValidateNested, IsArray, IsString, IsNotEmpty } from "class-validator";
import { CreateQuestionDto } from "src/question/dto/create-question.dto";

export class CreateQuizDto {

  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  niveauDifficulte: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
