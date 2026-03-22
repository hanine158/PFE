import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as argon2 from 'argon2';
import { Badge } from "src/badge/entities/badge.entity";
import { Progress } from "src/progress/entities/progress.entity";
import { Cour } from "src/cours/entities/cour.entity";

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    niveau: string;

    @Column()
    xp: number;

    @Column()
    password: string;

    @Column({ default: 'student' }) // Valeur par défaut
    role: string;

    @Column({ nullable: true, type: "varchar" })
    refreshToken: string | null;

    // Relations
    @OneToMany(() => Badge, (badge) => badge.user, {
        cascade: true,
    })
    badges: Badge[];

    @OneToMany(() => Cour, (cour) => cour.user, {
        cascade: true,
    })
    cours: Cour[];

    @OneToOne(() => Progress, (progress) => progress.user, {
        cascade: true,
        nullable: true,
        eager: false,
    })
    @JoinColumn()
    progress: Progress;

    // Hash mot de passe avant insert/update
    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith("$argon2")) {
            this.password = await argon2.hash(this.password);
        }
    }
}