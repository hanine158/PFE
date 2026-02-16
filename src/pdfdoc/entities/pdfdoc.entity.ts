import { Cour } from "src/cours/entities/cour.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity , JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity("pdfdoc")
export class Pdfdoc {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nomfichier: string;

    @Column()
    contenutexteextrait: string;

    @Column()
    urlstockage: string;

    @OneToOne(() => Cour, (cours) => cours.pdf, {
           cascade:true,
           nullable: true,
           eager: false
    })

           @JoinColumn()
           cours:Cour;
  


    

}
