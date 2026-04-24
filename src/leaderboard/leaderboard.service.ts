import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User, UserRole } from '../user/entities/user.entity';
import { Cour } from '../cours/entities/cour.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Cour)
    private readonly courRepository: Repository<Cour>,
  ) {}

  async getLeaderboard(filter: string = 'all') {
    const users = await this.userRepository.find({
      where: { role: UserRole.STUDENT },
      order: { xp: 'DESC' },
    });

    const totalCourses = await this.courRepository.count();

    const students = users.map((user, index) => {
      const xp = Number(user.xp || 0);

      return {
        id: user.id,
        rank: index + 1,
        name: user.name,
        email: user.email,
        avatar: user.name ? user.name.charAt(0).toUpperCase() : 'U',
        xp,
        level: user.level || 1,
        badges: 0,
        courses: 0,
        streak: 0,
        weeklyXP: filter === 'weekly' ? xp : 0,
        monthlyXP: filter === 'monthly' ? xp : 0,
        trend: 'up',
        bio: 'Étudiant LearnX',
      };
    });

    return {
      students,
      summary: {
        totalStudents: students.length,
        totalCourses,
        totalBadges: students.reduce((sum, s) => sum + Number(s.badges || 0), 0),
        bestStreak: students.length
          ? Math.max(...students.map((s) => Number(s.streak || 0)))
          : 0,
      },
    };
  }
}