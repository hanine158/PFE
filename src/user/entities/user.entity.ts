import { argon2d } from "argon2";
import { Badge } from "src/badge/entities/badge.entity";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, TableExclusion, TableInheritance } from "typeorm";
import*  as argon2 from 'argon2';
@Entity("user")

export class User {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
    @Column()
    email:string
    @Column()
    niveau:string

    @Column()
    xp:number

    @Column("simple-array")
    badges:Badge[]

    @Column()
    password:string;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(this.password && this.password.startsWith("$argon2")){
            this.password = await argon2.hash(this.password)
        }
    }

   
}