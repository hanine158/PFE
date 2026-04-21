import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherNotificationDto } from './dto/create-teacher-notification.dto';
import { UpdateTeacherNotificationDto } from './dto/update-teacher-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherNotification } from './entities/teacher-notification.entity';

@Injectable()
export class TeacherNotificationsService {
  constructor(
    @InjectRepository(TeacherNotification)
    private readonly teacherNotificationRepository: Repository<TeacherNotification>,
  ) {}

  async create(createTeacherNotificationDto: CreateTeacherNotificationDto) {
    const notification = this.teacherNotificationRepository.create({
      ...createTeacherNotificationDto,
      type: createTeacherNotificationDto.type || 'info',
      read: false,
    });

    return await this.teacherNotificationRepository.save(notification);
  }

  async findAll(userId?: number) {
    if (userId) {
      return await this.teacherNotificationRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    }

    return await this.teacherNotificationRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number) {
    const notification = await this.teacherNotificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new NotFoundException('Teacher notification introuvable');
    }

    return notification;
  }

  async update(id: number, updateTeacherNotificationDto: UpdateTeacherNotificationDto) {
    const notification = await this.findOne(id);

    Object.assign(notification, updateTeacherNotificationDto);

    return await this.teacherNotificationRepository.save(notification);
  }

  async remove(id: number) {
    const notification = await this.findOne(id);
    await this.teacherNotificationRepository.remove(notification);
    return { message: 'Notification supprimée' };
  }

  async markAsRead(id: number) {
    const notification = await this.findOne(id);
    notification.read = true;
    return await this.teacherNotificationRepository.save(notification);
  }

  async markAllAsRead(userId: number) {
    const notifications = await this.teacherNotificationRepository.find({
      where: { userId, read: false },
    });

    for (const notif of notifications) {
      notif.read = true;
    }

    await this.teacherNotificationRepository.save(notifications);

    return { message: 'Toutes les notifications ont été marquées comme lues' };
  }
}