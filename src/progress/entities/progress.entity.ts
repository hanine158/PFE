import { User } from "src/user/entities/user.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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



    @OneToOne(() => User, (user) => user.progress)
    user: User;
    }





