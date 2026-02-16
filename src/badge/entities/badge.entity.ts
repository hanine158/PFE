import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => User, (user) => user.badges,{
        onDelete:"CASCADE"
    })
    @JoinColumn()
    user: User;




}
