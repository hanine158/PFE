import { Quiz } from "src/quiz/entities/quiz.entity";
import { Schema } from "src/schema/entities/schema.entity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("analyse-re")
export class AnalyseRe {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"simple-array"})
    schemas:Schema[];

    @Column({type:"simple-array"})
    quiz:Quiz[];

    @Column({type:"simple-array"})
    questions:string[];


}
