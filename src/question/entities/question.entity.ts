import { AnalyseRe } from "src/analyse-res/entities/analyse-re.entity";
import { Quiz } from "src/quiz/entities/quiz.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("question")
export class Question {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texte: string;

  @Column()
  type: string;

  @Column({ type: "simple-array" })
  options: string[];

  @Column()
  reponse: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: "CASCADE",
    nullable: true
  })
  quiz: Quiz;   

  @ManyToOne(() => AnalyseRe, (analyseRe) => analyseRe.questions, {
    onDelete: "CASCADE",
    nullable: true
  })
  analyseRe: AnalyseRe;
}

