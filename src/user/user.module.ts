import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { User } from './entities/user.entity';
import { Badge } from '../badge/entities/badge.entity';
import { UserBadge } from './entities/user-badge.entity';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { BadgeUnlockService } from '../badge/badge-unlock.service';
import { AuthModule } from '../auth/auth.module';
import { AdminNotificationsModule } from '../admin-notifications/admin-notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Badge, UserBadge]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
    }),
    AuthModule,
    AdminNotificationsModule,
  ],
  providers: [UserService, BadgeUnlockService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}