// src/pdfdoc/entities/pdfdoc.entity.ts
import { Cour } from '../../cours/entities/cour.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, CreateDateColumn, JoinColumn } from 'typeorm';

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

  @OneToOne(() => Cour, (cour) => cour.pdf, { nullable: true })
  @JoinColumn()
  cours!: Cour | null;

  @CreateDateColumn()
  createdAt!: Date;
}