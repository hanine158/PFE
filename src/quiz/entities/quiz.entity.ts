import { AnalyseRe } from "src/analyse-res/entities/analyse-re.entity";
import { Question } from "src/question/entities/question.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

      @ManyToMany(() => AnalyseRe, (analyse) => analyse.quizs)
  @JoinTable({
    name: 'analyse_quiz',
    joinColumn: {
      name: 'quiz_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'analyseRe_id',
      referencedColumnName: 'id',
    },
  })
  analyseRe: AnalyseRe[];

    

}
