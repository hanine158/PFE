import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../user/entities/user.entity';

type LeaderboardFilter = 'all' | 'weekly' | 'monthly';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getLeaderboard(rawFilter: string) {
    const filter: LeaderboardFilter =
      rawFilter === 'weekly' || rawFilter === 'monthly' ? rawFilter : 'all';

    const users = await this.userRepository.find({
      where: { role: UserRole.STUDENT },
      relations: ['userBadges', 'userBadges.badge'],
      order: { xp: 'DESC' },
    });

    const students = users.map((user) => {
      const badges = Array.isArray(user.userBadges) ? user.userBadges.length : 0;
      const xp = Number(user.xp || 0);

      // Tant que tu n'as pas encore d'historique weekly/monthly en base,
      // on calcule une estimation stable côté backend au lieu de hardcoder dans le JSX.
      const weeklyXP = Math.floor(xp * 0.2);
      const monthlyXP = Math.floor(xp * 0.75);

      return {
        id: user.id,
        name: user.name || 'Étudiant',
        level: Number(user.level || 1),
        xp,
        avatar: this.buildAvatar(user.name),
        trend: weeklyXP >= 100 ? 'up' : 'down',
        badges,
        courses: Number((user as any).coursesCompleted || 0),
        streak: Number((user as any).streak || 0),
        weeklyXP,
        monthlyXP,
        bio: user.bio || 'Étudiant LearnX',
      };
    });

    const sorted = [...students].sort((a, b) => {
      if (filter === 'weekly') return b.weeklyXP - a.weeklyXP;
      if (filter === 'monthly') return b.monthlyXP - a.monthlyXP;
      return b.xp - a.xp;
    });

    const rankedStudents = sorted.map((student, index) => ({
      ...student,
      rank: index + 1,
    }));

    const summary = {
      totalStudents: rankedStudents.length,
      totalCourses: rankedStudents.reduce((sum, s) => sum + s.courses, 0),
      totalBadges: rankedStudents.reduce((sum, s) => sum + s.badges, 0),
      bestStreak:
        rankedStudents.length > 0
          ? Math.max(...rankedStudents.map((s) => s.streak))
          : 0,
    };

    return {
      filter,
      students: rankedStudents,
      summary,
    };
  }

  private buildAvatar(name?: string): string {
    if (!name) return 'U';

    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();

    return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
  }
}