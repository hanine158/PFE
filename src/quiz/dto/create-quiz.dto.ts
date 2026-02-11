import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Question } from "src/question/entities/question.entity";

export class CreateQuizDto {

  

     @IsString()
     @IsNotEmpty()
     titre:string;

     @IsString()
     @IsNotEmpty()
     niveauDifficulte:string;

     @IsNotEmpty()
     questions:Question[];

}
