import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Auth {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  email!: string;

  @Column()
  password!: string;

  @Column()
  role!: string; // etudiant / enseignant

  @Column({ nullable: true, type: 'text' }) // Explicitly specify column type
  refreshToken!: string | null;
}