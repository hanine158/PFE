import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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
}
