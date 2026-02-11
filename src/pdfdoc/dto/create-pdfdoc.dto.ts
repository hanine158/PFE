import { IsNotEmpty, IsString } from "class-validator";

export class CreatePdfdocDto {

     

    @IsString()
    @IsNotEmpty()
    nomfichier: string;

    @IsString()
    @IsNotEmpty()
    contenutexteextrait: string;

    @IsString()
    @IsNotEmpty()
    urlstockage: string;
}
