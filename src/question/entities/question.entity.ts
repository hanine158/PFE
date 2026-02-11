import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("question")
export class Question {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    texte:string;

    @Column()
    type:string;

    @Column({type:"simple-array"})
    options:string[];

    @Column()
    reponse:string;
}
