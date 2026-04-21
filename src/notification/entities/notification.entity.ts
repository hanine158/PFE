import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

export enum NotificationType {
  COURSE = 'course',
  QUIZ = 'quiz',
  MESSAGE = 'message',
  BADGE = 'badge',
  ACHIEVEMENT = 'achievement',
  COMMENT = 'comment',
  EVENT = 'event',
}

export enum NotificationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.MESSAGE,
  })
  type!: NotificationType;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  message!: string;

  @Column({ default: false })
  read!: boolean;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority!: NotificationPriority;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  actionLink?: string;

  @Column({ nullable: true })
  score?: string;

  @Column({ nullable: true })
  badgeName?: string;

  @Column({ nullable: true })
  sender?: string;

  @Column({ nullable: true })
  username?: string;

  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @CreateDateColumn()
  createdAt!: Date;
}