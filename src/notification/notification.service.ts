import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async createForUser(
    userId: number,
    dto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...dto,
      userId,
      read: false,
    });

    return await this.notificationRepository.save(notification);
  }

  async findAllForUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOneForUser(userId: number, id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id, userId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }

  async markAsRead(userId: number, id: number): Promise<Notification> {
    const notification = await this.findOneForUser(userId, id);
    notification.read = true;
    return await this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<{ message: string }> {
    const notifications = await this.notificationRepository.find({
      where: { userId, read: false },
    });

    for (const notification of notifications) {
      notification.read = true;
    }

    await this.notificationRepository.save(notifications);

    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }

  async deleteOne(userId: number, id: number): Promise<{ message: string }> {
    const notification = await this.findOneForUser(userId, id);
    await this.notificationRepository.remove(notification);
    return { message: 'Notification supprimée avec succès' };
  }

  async deleteAll(userId: number): Promise<{ message: string }> {
    await this.notificationRepository.delete({ userId });
    return { message: 'Toutes les notifications ont été supprimées' };
  }

  async getStats(userId: number) {
    const notifications = await this.findAllForUser(userId);

    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    const read = notifications.filter((n) => n.read).length;

    return {
      total,
      unread,
      read,
    };
  }
}