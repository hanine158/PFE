import { Question } from "../../question/entities/question.entity";
import { Quiz } from "../../quiz/entities/quiz.entity";
import { Schema } from "../../schema/entities/schema.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("analyse-re")
export class AnalyseRe {

  @PrimaryGeneratedColumn()
  id!: number;

  
  schemas!: Schema[];

  @OneToMany(() => Quiz, (quiz) => quiz.analyseRe, {
    cascade: true,
  })
  quizs!: Quiz[];

  @OneToMany(() => Question, (question) => question.analyseRe, {
    cascade: true,
  })
  questions!: Question[];
}