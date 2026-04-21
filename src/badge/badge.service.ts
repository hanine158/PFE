import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Repository } from 'typeorm';
import { Badge } from './entities/badge.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBadge } from '../user/entities/user-badge.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BadgeService implements OnModuleInit {
  constructor(
    @InjectRepository(Badge)
    private readonly badgeRepository: Repository<Badge>,

    @InjectRepository(UserBadge)
    private readonly userBadgeRepository: Repository<UserBadge>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedBadges();
  }

  private async seedBadges() {
    const badges = [
      { nom: 'Premier Pas', icone: '🌟', description: 'Ouvrir son premier menu', requiredXp: 0 },
      { nom: 'Apprenti', icone: '📚', description: 'Atteindre 100 XP', requiredXp: 100 },
      { nom: 'Confirmé', icone: '⚡', description: 'Atteindre 300 XP', requiredXp: 300 },
      { nom: 'Expert', icone: '🏆', description: 'Atteindre 600 XP', requiredXp: 600 },
      { nom: 'Maître', icone: '👑', description: 'Atteindre 1000 XP', requiredXp: 1000 },
    ];

    for (const b of badges) {
      const exists = await this.badgeRepository.findOne({
        where: { nom: b.nom },
      });

      if (!exists) {
        await this.badgeRepository.save(this.badgeRepository.create(b));
      }
    }
  }

  async findAll() {
    return await this.badgeRepository.find({
      order: { requiredXp: 'ASC' },
    });
  }

  async findOne(id: number) {
    return await this.badgeRepository.findOneOrFail({ where: { id } });
  }

  async create(dto: CreateBadgeDto) {
    return await this.badgeRepository.save(this.badgeRepository.create(dto));
  }

  async update(id: number, dto: UpdateBadgeDto) {
    await this.badgeRepository.update(id, dto);
    return await this.findOne(id);
  }

  async remove(id: number) {
    await this.badgeRepository.delete(id);
  }

  // ✅ LOGIQUE IMPORTANTE
  async assignBadgesToUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userBadges', 'userBadges.badge'],
    });

    if (!user) return;

    const allBadges = await this.badgeRepository.find({
      order: { requiredXp: 'ASC' },
    });

    const alreadyEarnedBadgeIds = new Set(
      (user.userBadges || []).map((ub) => ub.badge.id),
    );

    const eligibleBadges = allBadges.filter(
      (badge) =>
        Number(user.xp || 0) >= Number(badge.requiredXp || 0) &&
        !alreadyEarnedBadgeIds.has(badge.id),
    );

    for (const badge of eligibleBadges) {
      const userBadge = this.userBadgeRepository.create({
        user,
        badge,
      });

      await this.userBadgeRepository.save(userBadge);
    }
  }
}