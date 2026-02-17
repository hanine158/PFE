import { AnalyseRe } from "src/analyse-res/entities/analyse-re.entity";
import { Question } from "src/question/entities/question.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("quiz")
export class Quiz {

  @PrimaryGeneratedColumn()
  id: number;     

  @Column()
  titre: string;

  @Column()
  niveauDifficulte: string;

  @ManyToOne(() => AnalyseRe, (analyse) => analyse.quizs, {
    onDelete: "CASCADE",
  })
  analyseRe: AnalyseRe;

  @OneToMany(() => Question, (question) => question.quiz, {
    cascade: true,
  })
  questions: Question[];
}

