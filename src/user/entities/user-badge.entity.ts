import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Badge } from '../../badge/entities/badge.entity';

@Entity('user_badge')
@Unique(['user', 'badge'])
export class UserBadge {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user: User) => user.userBadges, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Badge, (badge: Badge) => badge.userBadges, {
    onDelete: 'CASCADE',
  })
  badge!: Badge;

  @CreateDateColumn()
  createdAt!: Date;
}
