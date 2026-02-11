import { IsNotEmpty, IsString } from "class-validator";

export class CreateCourDto {
    @IsString()
    @IsNotEmpty()
    id:string;

     @IsString()
    @IsNotEmpty()
    titre:string;

}
