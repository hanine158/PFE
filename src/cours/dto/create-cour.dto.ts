import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourDto {
   

     @IsString()
    @IsNotEmpty()
    titre:string;
    @IsNumber()
    user:number;

}
