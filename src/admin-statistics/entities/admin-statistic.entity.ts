import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('admin_settings')
export class AdminSetting {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: true })
  emailNotifications!: boolean;

  @Column({ default: true })
  pushNotifications!: boolean;

  @Column({ default: true })
  newUserAlert!: boolean;

  @Column({ default: true })
  courseAlert!: boolean;

  @Column({ default: true })
  paymentAlert!: boolean;

  @Column({ default: false })
  twoFactor!: boolean;

  @Column({ default: '30' })
  sessionTimeout!: string;

  @Column({ default: true })
  loginAlerts!: boolean;

  @Column({ default: 'dark' })
  theme!: string;

  @Column({ default: 'fr' })
  language!: string;

  @Column({ default: false })
  compactMode!: boolean;

  @Column({ nullable: true })
  smtpServer?: string;

  @Column({ nullable: true })
  smtpPort?: string;

  @Column({ nullable: true })
  senderEmail?: string;

  @Column({ nullable: true })
  senderPassword?: string;

  @Column({ default: 'Quotidienne' })
  backupFrequency!: string;

  @Column({ nullable: true })
  lastBackup?: string;

  @Column({ nullable: true })
  backupSize?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}