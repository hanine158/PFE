import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateProgressDto {

 

    @IsNotEmpty()
    @IsNumber()
    quizComplete: number;

    @IsNotEmpty()
    @IsNumber()
    scoretotal: number;

    @IsNotEmpty()
    @IsNumber()
    tempsEtude: number;
   

      @IsNumber()
    user:number;


}