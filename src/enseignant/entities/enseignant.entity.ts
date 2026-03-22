import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('enseignants')
export class Enseignant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nom: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;
}