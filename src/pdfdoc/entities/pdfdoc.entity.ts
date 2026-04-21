import { Cour } from '../../cours/entities/cour.entity';
import {
  Column,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('pdfdoc')
export class Pdfdoc {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  filename!: string;

  @Column()
  originalName!: string;

  @Column()
  filePath!: string;

  @Column({ type: 'int' })
  fileSize!: number;

  @Column()
  mimeType!: string;

  @Column({ default: 'pending' })
  status!: string;

  @OneToOne(() => Cour, (cour) => cour.pdf, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'courId' })
  cours!: Cour | null;

  @CreateDateColumn()
  createdAt!: Date;
}