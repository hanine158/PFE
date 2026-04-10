import { AnalyseRe } from "../../analyse-res/entities/analyse-re.entity";
import { Quiz } from "../../quiz/entities/quiz.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("question")
export class Question {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  texte!: string;

  @Column()
  type!: string;

  @Column({ type: "simple-array", default: [] })
  options!: string[];

  @Column()
  reponse!: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions, {
    onDelete: "CASCADE",
    nullable: true
  })
  quiz!: Quiz | null;

  @ManyToOne(() => AnalyseRe, (analyseRe) => analyseRe.questions, {
    onDelete: "CASCADE",
    nullable: true
  })
  analyseRe!: AnalyseRe | null;
}