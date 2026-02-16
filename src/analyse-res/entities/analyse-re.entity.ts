import { Question } from "src/question/entities/question.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
import { Schema } from "src/schema/entities/schema.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("analyse-re")
export class AnalyseRe {

    @PrimaryGeneratedColumn()
    id:number;

    @Column({type:"simple-array"})
    schemas:Schema[];

    @Column({type:"simple-array"})
    quiz:Quiz[];

    @Column({type:"simple-array"})
    questions:Question[];



 @ManyToMany(() => Schema, (schema) => schema.analyseRe)
  schema: Schema[];

  
@ManyToMany(() => Quiz, (quiz) => quiz.analyseRe)
  quizs: Quiz[];

  @ManyToMany(() => Question, (question) => question.analyseRe)
question: Question[];

}












