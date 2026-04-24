import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { NotificationService } from '../notification/notification.service';

// 🔥 IMPORT ENUMS (IMPORTANT)
import {
  NotificationType,
  NotificationPriority,
} from '../notification/entities/notification.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,

    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,

    private readonly notificationService: NotificationService,
  ) {}

  async createOrGetConversation(
    dto: CreateConversationDto,
  ): Promise<Conversation> {
    const existingConversation = await this.conversationRepository.findOne({
      where: {
        studentId: dto.studentId,
        teacherId: dto.teacherId,
      },
    });

    if (existingConversation) return existingConversation;

    const conversation = this.conversationRepository.create({
      studentId: dto.studentId,
      studentName: dto.studentName,
      teacherId: dto.teacherId,
      teacherName: dto.teacherName,
      lastMessage: '',
      lastMessageTime: '',
      unreadStudent: 0,
      unreadTeacher: 0,
    });

    return await this.conversationRepository.save(conversation);
  }

  async getConversationsByUser(
    userId: number,
    role: 'student' | 'teacher',
  ): Promise<Conversation[]> {
    return await this.conversationRepository.find({
      where: role === 'student' ? { studentId: userId } : { teacherId: userId },
      order: { updatedAt: 'DESC' },
    });
  }

  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation introuvable');
    }

    return await this.messageRepository.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  async createMessage(dto: CreateMessageDto): Promise<Message> {
    const conversation = await this.conversationRepository.findOne({
      where: { id: dto.conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation introuvable');
    }

    const message = this.messageRepository.create({
      conversationId: dto.conversationId,
      senderId: dto.senderId,
      senderRole: dto.senderRole,
      text: dto.text,
      isRead: false,
    });

    const savedMessage = await this.messageRepository.save(message);

    // 🔥 Mise à jour conversation
    conversation.lastMessage = dto.text;
    conversation.lastMessageTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 🔥 NOTIFICATIONS AVEC ENUMS
    if (dto.senderRole === 'student') {
      conversation.unreadTeacher += 1;

      await this.notificationService.createForUser(
        conversation.teacherId,
        {
          title: 'Nouveau message',
          message: `${conversation.studentName} vous a envoyé un message`,
          icon: '💬',
          type: NotificationType.MESSAGE,
          priority: NotificationPriority.MEDIUM,
        },
      );
    } else {
      conversation.unreadStudent += 1;

      await this.notificationService.createForUser(
        conversation.studentId,
        {
          title: 'Nouveau message',
          message: `${conversation.teacherName} vous a envoyé un message`,
          icon: '💬',
          type: NotificationType.MESSAGE,
          priority: NotificationPriority.MEDIUM,
        },
      );
    }

    await this.conversationRepository.save(conversation);

    return savedMessage;
  }

  async markMessagesAsRead(
    conversationId: number,
    role: 'student' | 'teacher',
  ) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation introuvable');
    }

    const otherRole = role === 'student' ? 'teacher' : 'student';

    await this.messageRepository.update(
      {
        conversationId,
        senderRole: otherRole,
        isRead: false,
      },
      {
        isRead: true,
      },
    );

    if (role === 'student') {
      conversation.unreadStudent = 0;
    } else {
      conversation.unreadTeacher = 0;
    }

    await this.conversationRepository.save(conversation);

    return { message: 'Messages marqués comme lus' };
  }
}