import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as argon2 from 'argon2';
import { Badge } from "../../badge/entities/badge.entity";
import { Progress } from "../../progress/entities/progress.entity";
import { Cour } from "../../cours/entities/cour.entity";

// ✅ Enum pour les rôles
export enum UserRole {
    STUDENT = 'student',
    TEACHER = 'teacher',
    ADMIN = 'admin'
}

@Entity("user")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ 
        type: 'enum', 
        enum: UserRole, 
        default: UserRole.STUDENT 
    })
    role!: UserRole;

    @Column({ nullable: true, type: "varchar" })
    refreshToken!: string | null;

    // Relations
    @OneToMany(() => Badge, (badge) => badge.user, {
        cascade: true,
    })
    badges!: Badge[];

    @OneToMany(() => Cour, (cour) => cour.user, {
        cascade: true,
    })
    cours!: Cour[];

    @OneToOne(() => Progress, (progress) => progress.user, {
        cascade: true,
        nullable: true,
        eager: false,
    })
    @JoinColumn()
    progress!: Progress | null;

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword() {
        if (this.password && !this.password.startsWith("$argon2")) {
            this.password = await argon2.hash(this.password);
        }
    }
}