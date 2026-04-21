import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as argon2 from 'argon2';

import { UserBadge } from './user-badge.entity';
import { Cour } from '../../cours/entities/cour.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { Notification } from '../../notification/entities/notification.entity';

export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role!: UserRole;

  @Column({ type: 'int', default: 0 })
  xp!: number;

  @Column({ type: 'int', default: 1 })
  level!: number;

  @Column({ nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ default: 'fr' })
  language!: string;

  @Column({ default: 'Africa/Casablanca' })
  timezone!: string;

  @Column({ default: true })
  emailNotifications!: boolean;

  @Column({ default: true })
  pushNotifications!: boolean;

  @Column({ default: true })
  newMessage!: boolean;

  @Column({ default: true })
  newCourse!: boolean;

  @Column({ default: false })
  systemUpdates!: boolean;

  @Column({ default: true })
  weeklyDigest!: boolean;

  @Column({ default: false })
  twoFactorAuth!: boolean;

  @Column({ default: '30' })
  sessionTimeout!: string;

  @Column({ default: true })
  loginAlerts!: boolean;

  @Column({ default: 'public' })
  profileVisibility!: string;

  @Column({ default: true })
  showEmail!: boolean;

  @Column({ default: false })
  showPhone!: boolean;

  @Column({ default: true })
  showCourses!: boolean;

  @Column('simple-array', { nullable: true })
  specializations?: string[];

  @OneToMany(() => UserBadge, (userBadge) => userBadge.user, {
    cascade: true,
  })
  userBadges!: UserBadge[];

  @OneToMany(() => Cour, (cour) => cour.user)
  cours!: Cour[];

  @OneToOne(() => Progress, (progress) => progress.user, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  progress!: Progress | null;

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications!: Notification[];

  @Column({ type: 'varchar', nullable: true })
  refreshToken!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith('$argon2')) {
      this.password = await argon2.hash(this.password);
    }
  }
}