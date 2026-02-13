import { IsNotEmpty } from "class-validator";
import { Question } from "src/question/entities/question.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
import { Schema } from "src/schema/entities/schema.entity";

export class CreateAnalyseReDto {


    @IsNotEmpty()
    schemas:Schema[];

    @IsNotEmpty()
    quiz:Quiz[];

    @IsNotEmpty()
    questions:Question[];
    
}
