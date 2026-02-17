import { Question } from "src/question/entities/question.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
import { Schema } from "src/schema/entities/schema.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("analyse-re")
export class AnalyseRe {

  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Schema, (schema) => schema.analyseRe, {
    cascade: true,
  })
  schemas: Schema[];

  @OneToMany(() => Quiz, (quiz) => quiz.analyseRe, {
    cascade: true,
  })
  quizs: Quiz[];

  @OneToMany(() => Question, (question) => question.analyseRe, {
    cascade: true,
  })
  questions: Question[];
}
















