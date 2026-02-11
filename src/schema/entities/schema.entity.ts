import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("schema")
export class Schema {

    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    titre:string;

    @Column()
    contenu:string;

    @Column()
    imageUrl:string;
}
