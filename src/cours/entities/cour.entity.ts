import { Pdfdoc } from "src/pdfdoc/entities/pdfdoc.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("cours")
export class Cour {
     
     @PrimaryGeneratedColumn()
    id:number;

    @Column()
    titre:string;

    
        @ManyToOne(() => User, (User) => User.id, {
            onDelete: "CASCADE",
        })
        @JoinColumn({ name: "userId" })
        user: User;

        @OneToOne(() =>Pdfdoc, Pdfdoc=>Pdfdoc.id)
        @JoinColumn()
        pdf: Pdfdoc;

}  
