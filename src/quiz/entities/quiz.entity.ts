import { Question } from "src/question/entities/question.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("quiz")
export class Quiz {

    @PrimaryGeneratedColumn()
    id:string;

    @Column()
    titre:string;

    @Column()
    niveauDifficulte:string;

    @Column({type:"simple-array"})
    questions:Question[];

    

}
