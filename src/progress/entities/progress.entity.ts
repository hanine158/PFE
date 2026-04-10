import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("progress")
export class Progress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  quizComplete!: number;

  @Column({ default: 0 })
  scoretotal!: number;

  @Column({ default: 0 })
  tempsEtude!: number;

  @OneToOne(() => User, (user) => user.progress)
  @JoinColumn()
  user!: User;
}