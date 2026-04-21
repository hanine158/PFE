import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('admin_settings')
export class AdminSetting {
  @PrimaryColumn()
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

  @Column({ default: '' })
  smtpServer!: string;

  @Column({ default: '587' })
  smtpPort!: string;

  @Column({ default: '' })
  senderEmail!: string;

  @Column({ default: '' })
  senderPassword!: string;

  @Column({ default: 'Quotidienne' })
  backupFrequency!: string;

  @Column({ default: '' })
  lastBackup!: string;

  @Column({ default: '' })
  backupSize!: string;
}