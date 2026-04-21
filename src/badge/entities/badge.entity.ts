import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserBadge } from '../../user/entities/user-badge.entity';

@Entity('badge')
export class Badge {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column()
  icone!: string;

  @Column()
  description!: string;

  @Column({ default: 0 })
  requiredXp!: number;

  @OneToMany(() => UserBadge, (userBadge) => userBadge.badge)
  userBadges!: UserBadge[];
}