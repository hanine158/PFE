import { argon2d } from "argon2";
import { Badge } from "src/badge/entities/badge.entity";
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, TableExclusion, TableInheritance } from "typeorm";
import*  as argon2 from 'argon2';
import { Progress } from "src/progress/entities/progress.entity";
import { Cour } from "src/cours/entities/cour.entity";
@Entity("user")

export class User {
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    name:string
    @Column({unique:true})
    email:string
    @Column()
    niveau:string

    @Column()
    xp:number

    @Column("simple-array")
    badges:Badge[]

    @Column()
    password:string;

   @Column({ nullable: true, type: "varchar" })
refreshToken: string;


       @OneToMany(()=> Badge, (Badge)=>Badge.user,{
        cascade:true,
       })
       badge: Badge[];

       @OneToMany(() => Cour, (Cour) => Cour.user, {
        cascade:true
       })
        cour: Cour[];
  
    @OneToOne(() => Progress, (progress) => progress.user, {
        cascade:true,
        nullable: true,
        eager: false

    })
   @JoinColumn()
   progress: Progress;


       @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if(this.password && !this.password.startsWith("$argon2")){
            this.password = await argon2.hash(this.password)
        }
    }
   
   }

