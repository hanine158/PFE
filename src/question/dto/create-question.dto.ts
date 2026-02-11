import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateQuestionDto {

    @IsString()
    @IsNotEmpty()
    texte: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString({ each: true })
    @IsNotEmpty()
    options: string[];

    @IsString()
    @IsNotEmpty()
    reponse: string;
}
