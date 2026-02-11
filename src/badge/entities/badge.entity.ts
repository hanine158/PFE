import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

 @Entity("badge")
export class Badge {
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    nom:string;

    @Column()
    icone:string;

    @Column()
    description:string;




}
