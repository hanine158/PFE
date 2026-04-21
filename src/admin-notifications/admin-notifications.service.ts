import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAdminNotificationDto } from './dto/create-admin-notification.dto';
import { UpdateAdminNotificationDto } from './dto/update-admin-notification.dto';
import {
  AdminNotification,
  NotificationStatus,
} from './entities/admin-notification.entity';

@Injectable()
export class AdminNotificationsService {
  constructor(
    @InjectRepository(AdminNotification)
    private readonly adminNotificationRepository: Repository<AdminNotification>,
  ) {}

  async create(
    createAdminNotificationDto: CreateAdminNotificationDto,
  ): Promise<AdminNotification> {
    const notification = this.adminNotificationRepository.create({
      ...createAdminNotificationDto,
      icon: createAdminNotificationDto.icon ?? '🔔',
    });

    return await this.adminNotificationRepository.save(notification);
  }

  async findAll(status?: string): Promise<AdminNotification[]> {
    if (status) {
      return await this.adminNotificationRepository.find({
        where: { status: status as NotificationStatus },
        order: { createdAt: 'DESC' },
      });
    }

    return await this.adminNotificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<AdminNotification> {
    const notification = await this.adminNotificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException(`Notification ${id} introuvable`);
    }

    return notification;
  }

  async update(
    id: number,
    updateAdminNotificationDto: UpdateAdminNotificationDto,
  ): Promise<AdminNotification> {
    const notification = await this.findOne(id);

    Object.assign(notification, updateAdminNotificationDto);

    return await this.adminNotificationRepository.save(notification);
  }

  async markAsRead(id: number): Promise<AdminNotification> {
    const notification = await this.findOne(id);
    notification.status = NotificationStatus.READ;

    return await this.adminNotificationRepository.save(notification);
  }

  async markAllAsRead(): Promise<{ message: string }> {
    await this.adminNotificationRepository.update(
      { status: NotificationStatus.UNREAD },
      { status: NotificationStatus.READ },
    );

    return {
      message: 'Toutes les notifications ont été marquées comme lues',
    };
  }

  async remove(id: number): Promise<{ message: string }> {
    const notification = await this.findOne(id);
    await this.adminNotificationRepository.remove(notification);

    return {
      message: 'Notification supprimée avec succès',
    };
  }

  async removeAllRead(): Promise<{ message: string }> {
    await this.adminNotificationRepository.delete({
      status: NotificationStatus.READ,
    });

    return {
      message: 'Toutes les notifications lues ont été supprimées',
    };
  }

  async getStats(): Promise<{
    total: number;
    unread: number;
    read: number;
  }> {
    const total = await this.adminNotificationRepository.count();
    const unread = await this.adminNotificationRepository.count({
      where: { status: NotificationStatus.UNREAD },
    });
    const read = await this.adminNotificationRepository.count({
      where: { status: NotificationStatus.READ },
    });

    return {
      total,
      unread,
      read,
    };
  }
}