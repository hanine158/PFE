import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Cour } from '../../cours/entities/cour.entity';

@Entity('schema')
export class Schema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  titre!: string;

  @Column({ type: 'text' })
  contenu!: string;

  @Column({ type: 'text', nullable: true })
  imageUrl!: string | null;

  @ManyToOne(() => Cour, {
    onDelete: 'CASCADE',
  })
  cour!: Cour;
}