import { Type } from "class-transformer";
import { ValidateNested, IsArray } from "class-validator";
import { CreateSchemaDto } from "src/schema/dto/create-schema.dto";
import { CreateQuizDto } from "src/quiz/dto/create-quiz.dto";
import { CreateQuestionDto } from "src/question/dto/create-question.dto";

export class CreateAnalyseReDto {

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSchemaDto)
  schemas: CreateSchemaDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizDto)
  quizs: CreateQuizDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];
}
