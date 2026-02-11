import { IsNotEmpty } from "class-validator";
import { Quiz } from "src/quiz/entities/quiz.entity";
import { Schema } from "src/schema/entities/schema.entity";

export class CreateAnalyseReDto {


    @IsNotEmpty()
    schemas:Schema[];

    @IsNotEmpty()
    quiz:Quiz[];
    
}
