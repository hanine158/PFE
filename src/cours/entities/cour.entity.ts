import { Pdfdoc } from '../../pdfdoc/entities/pdfdoc.entity';
import { User } from '../../user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cours')
export class Cour {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  category?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price!: number;

  @Column({ default: 'pending' })
  status!: string;

  @ManyToOne(() => User, (user) => user.cours, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: false,
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @OneToOne(() => Pdfdoc, (pdfdoc) => pdfdoc.cours, {
    nullable: true,
    cascade: false,
  })
  pdf?: Pdfdoc | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}