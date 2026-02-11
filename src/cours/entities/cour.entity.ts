import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("cours")
export class Cour {
     
     @PrimaryGeneratedColumn()
    id:string;

    @Column()
    titre:string;

}
