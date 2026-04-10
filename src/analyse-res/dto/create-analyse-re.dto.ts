import { Type } from "class-transformer";
import { ValidateNested, IsArray } from "class-validator";
import { CreateSchemaDto } from "../../schema/dto/create-schema.dto";
import { CreateQuizDto } from "../../quiz/dto/create-quiz.dto";
import { CreateQuestionDto } from "../../question/dto/create-question.dto";

export class CreateAnalyseReDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSchemaDto)
  schemas!: CreateSchemaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizDto)
  quizs!: CreateQuizDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions!: CreateQuestionDto[];
}