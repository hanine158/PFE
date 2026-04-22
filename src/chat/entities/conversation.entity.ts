import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from './message.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  studentId!: number;

  @Column()
  studentName!: string;

  @Column()
  teacherId!: number;

  @Column()
  teacherName!: string;

  @Column({ type: 'text', nullable: true })
  lastMessage!: string;

  @Column({ nullable: true })
  lastMessageTime!: string;

  @Column({ default: 0 })
  unreadStudent!: number;

  @Column({ default: 0 })
  unreadTeacher!: number;

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
  })
  messages!: Message[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}