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

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
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

  @Column({ type: 'varchar', nullable: true, default: null })
  phone!: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  bio!: string | null;

  @Column({ type: 'varchar', default: 'fr' })
  language!: string;

  @Column({ type: 'varchar', default: 'Africa/Casablanca' })
  timezone!: string;

  @Column({ type: 'boolean', default: true })
  emailNotifications!: boolean;

  @Column({ type: 'boolean', default: true })
  pushNotifications!: boolean;

  @Column({ type: 'boolean', default: true })
  newMessage!: boolean;

  @Column({ type: 'boolean', default: true })
  newCourse!: boolean;

  @Column({ type: 'boolean', default: false })
  systemUpdates!: boolean;

  @Column({ type: 'boolean', default: true })
  weeklyDigest!: boolean;

  @Column({ type: 'boolean', default: false })
  twoFactorAuth!: boolean;

  @Column({ type: 'varchar', default: '30' })
  sessionTimeout!: string;

  @Column({ type: 'boolean', default: true })
  loginAlerts!: boolean;

  @Column({ type: 'varchar', default: 'public' })
  profileVisibility!: string;

  @Column({ type: 'boolean', default: true })
  showEmail!: boolean;

  @Column({ type: 'boolean', default: false })
  showPhone!: boolean;

  @Column({ type: 'boolean', default: true })
  showCourses!: boolean;

  @Column('simple-array', { nullable: true, default: null })
  specializations!: string[] | null;

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

  @Column('text', { nullable: true, default: null })
  refreshToken!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password && !this.password.startsWith('$argon2')) {
      this.password = await argon2.hash(this.password);
    }
  }
}