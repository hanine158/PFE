import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Notification } from '../notification/entities/notification.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) {}

  async getUserStatistics(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userBadges', 'userBadges.badge'],
    });

    const notifications = await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 4,
    });

    const totalXP = Number(user?.xp || 0);
    const level = Number(user?.level || 1);
    const earnedBadges = Array.isArray(user?.userBadges)
      ? user.userBadges.length
      : 0;

    // En attendant les vraies tables quiz/course history
    const stats = {
      totalXP,
      xpThisWeek: Math.floor(totalXP * 0.18),
      xpLastWeek: Math.floor(totalXP * 0.15),
      coursesCompleted: 12,
      totalCourses: 24,
      quizzesPassed: 45,
      totalQuizzes: 60,
      averageScore: 78,
      bestScore: 95,
      totalHours: 156,
      streak: 15,
      certificates: 8,
      rank: 42,
      totalStudents: 1250,
      level,
      earnedBadges,
    };

    const chartData = {
      xp: {
        week: [120, 85, 95, 110, 75, 130, 100],
        month: [320, 450, 380, 520, 410, 480, 390, 510, 440, 470],
        year: [1200, 1450, 1320, 1580, 1420, 1650, 1800, 1950, 2100, 2250, 2350, totalXP],
      },
      quiz: {
        week: [75, 82, 78, 85, 80, 88, 92],
        month: [72, 75, 78, 80, 82, 85, 84, 86, 88, 90],
        year: [65, 68, 70, 72, 75, 78, 80, 82, 85, 87, 88, 90],
      },
      courses: {
        week: [1, 0, 1, 1, 0, 2, 1],
        month: [3, 2, 4, 3, 2, 4, 3, 2, 3, 4],
        year: [8, 6, 7, 9, 8, 10, 9, 11, 10, 12, 11, 12],
      },
    };

    const categories = [
      { name: 'Développement Web', progress: 75, hours: 58, icon: 'web' },
      { name: 'Data Science', progress: 45, hours: 35, icon: 'data' },
      { name: 'Design UX/UI', progress: 60, hours: 42, icon: 'design' },
      { name: 'Marketing Digital', progress: 30, hours: 21, icon: 'marketing' },
      { name: 'Intelligence Artificielle', progress: 25, hours: 18, icon: 'ai' },
      { name: 'Bases de données', progress: 55, hours: 40, icon: 'database' },
    ];

    const recentActivities =
      notifications.length > 0
        ? notifications.map((n) => ({
            title: n.title,
            description: n.message,
            time: n.createdAt,
            type: n.type,
          }))
        : [
            {
              title: 'Bienvenue',
              description: 'Commencez votre progression sur la plateforme',
              time: new Date(),
              type: 'system',
            },
          ];

    return {
      stats,
      chartData,
      categories,
      recentActivities,
    };
  }
}