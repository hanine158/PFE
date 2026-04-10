// src/cours/entities/cour.entity.ts
import { Pdfdoc } from "../../pdfdoc/entities/pdfdoc.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("cours")
export class Cour {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    titre!: string;

    @ManyToOne(() => User, (user) => user.cours, {
        onDelete: "CASCADE",
    })
    @JoinColumn({ name: "userId" })
    user!: User;

    @OneToOne(() => Pdfdoc, (pdfdoc) => pdfdoc.cours, { nullable: true })
    @JoinColumn()
    pdf!: Pdfdoc;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}