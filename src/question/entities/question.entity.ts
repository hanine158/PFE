import { AnalyseRe } from "src/analyse-res/entities/analyse-re.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity("question")
export class Question {

    @PrimaryGeneratedColumn()
    id:string;

    @Column()
    texte:string;

    @Column()
    type:string;

    @Column({type:"simple-array"})
    options:string[];

    @Column()
    reponse:string;
    

    
  @ManyToMany(() => AnalyseRe, (analyse) => analyse.question)
  @JoinTable({
    name: 'analyse_question',
    joinColumn: {
      name: 'question_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'analyseRe_id',
      referencedColumnName: 'id',
    },
  })
  analyseRe: AnalyseRe[];
    
}
