import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateSchemaDto {

  

    @IsString()
    @IsNotEmpty()
    titre:string;

    @IsString()
    @IsNotEmpty()
    contenu:string;

    @IsString()
    @IsNotEmpty()
    imageUrl:string;

}
