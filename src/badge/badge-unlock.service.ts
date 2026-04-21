import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { User, UserRole } from '../user/entities/user.entity';
import { UserBadge } from '../user/entities/user-badge.entity';

@Injectable()
export class BadgeUnlockService {
  constructor(
    @InjectRepository(Badge)
    private badgeRepository: Repository<Badge>,

    @InjectRepository(UserBadge)
    private userBadgeRepository: Repository<UserBadge>,
  ) {}

  async unlockBadgesForUser(user: User): Promise<Badge[]> {
    const allBadges = await this.badgeRepository.find();

    const userBadges = await this.userBadgeRepository.find({
      where: { user: { id: user.id } },
      relations: ['badge']
    });

    const owned = new Set(userBadges.map(b => b.badge.id));

    const unlocked: Badge[] = [];

    for (const badge of allBadges) {
      if (!owned.has(badge.id) && user.xp >= badge.requiredXp) {

        const ub = this.userBadgeRepository.create({
          user,
          badge
        });

        await this.userBadgeRepository.save(ub);
        unlocked.push(badge);
      }
    }

    return unlocked;
  }

  // ⭐ IMPORTANT (missing function)
  async assignFirstLoginBadge(user: User) {
    const badge = await this.badgeRepository.findOne({
      where: { requiredXp: 0 }
    });

    if (!badge) return null;

    const exists = await this.userBadgeRepository.findOne({
      where: {
        user: { id: user.id },
        badge: { id: badge.id }
      }
    });

    if (!exists) {
      const ub = this.userBadgeRepository.create({
        user,
        badge
      });

      return await this.userBadgeRepository.save(ub);
    }

    return null;
  }
}