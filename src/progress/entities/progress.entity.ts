import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("progress")
export class Progress {
  @PrimaryGeneratedColumn()
  idutilisateur: string;
   @Column()
    quizComplete: number; 


    @Column()
    scoretotal: number;

    @Column()
    tempsEtude: number;




}
