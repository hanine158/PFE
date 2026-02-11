import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("progress")
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;
   @Column()
    quizComplete: number; 


    @Column()
    scoretotal: number;

    @Column()
    tempsEtude: number;




}
