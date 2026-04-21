import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BadgeController } from './badge.controller';
import { BadgeService } from './badge.service';
import { BadgeUnlockService } from './badge-unlock.service';
import { Badge } from './entities/badge.entity';
import { UserBadge } from '../user/entities/user-badge.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Badge, UserBadge, User])],
  controllers: [BadgeController],
  providers: [BadgeService, BadgeUnlockService],
  exports: [BadgeService, BadgeUnlockService], // ✅ indispensable
})
export class BadgeModule {}