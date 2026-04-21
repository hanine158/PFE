import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as argon2 from 'argon2';
import { BadgeUnlockService } from '../badge/badge-unlock.service';
import { Badge } from '../badge/entities/badge.entity';
import { JwtService } from '@nestjs/jwt';

import { AdminNotificationsService } from '../admin-notifications/admin-notifications.service';
import {
  NotificationPriority,
  NotificationType,
} from '../admin-notifications/entities/admin-notification.entity';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly badgeUnlockService: BadgeUnlockService,
    private readonly jwtService: JwtService,
    private readonly adminNotificationsService: AdminNotificationsService,
  ) {}

  async onModuleInit() {
    await this.createDefaultAdmin();
  }

  public async createDefaultAdmin(): Promise<void> {
    try {
      const adminEmail = 'hanine@gmail.com';

      const existingAdmin = await this.userRepository.findOne({
        where: { email: adminEmail },
      });

      if (!existingAdmin) {
        const admin = this.userRepository.create({
          name: 'Hanine',
          email: adminEmail,
          password: await argon2.hash('admin123'),
          role: UserRole.ADMIN,
          xp: 0,
          level: 1,
        });

        const savedAdmin = await this.userRepository.save(admin);

        await this.adminNotificationsService.create({
          title: 'Nouvel administrateur ajouté',
          message: `${savedAdmin.name} a été ajouté comme administrateur`,
          type: NotificationType.SYSTEM,
          priority: NotificationPriority.HIGH,
          icon: '🛡️',
          actionUrl: `/admin/users/${savedAdmin.id}`,
        });
      }
    } catch (error) {
      this.logger.error(`Erreur admin: ${error}`);
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const exists = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    let role = UserRole.STUDENT;
    if (createUserDto.role === 'teacher') role = UserRole.TEACHER;
    if (createUserDto.role === 'admin') role = UserRole.ADMIN;

    const hashedPassword = await argon2.hash(createUserDto.password);

    const newUser = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role,
      xp: 0,
      level: 1,
    });

    const savedUser = await this.userRepository.save(newUser);

    if (savedUser.role === UserRole.STUDENT) {
      await this.badgeUnlockService.assignFirstLoginBadge(savedUser);
    }

    let title = 'Nouvel étudiant inscrit';
    let message = `${savedUser.name} vient de s'inscrire sur la plateforme`;
    let type = NotificationType.STUDENT;
    let priority = NotificationPriority.LOW;
    let icon = '👨‍🎓';
    let actionUrl = `/admin/students/${savedUser.id}`;

    if (savedUser.role === UserRole.TEACHER) {
      title = 'Nouvel enseignant inscrit';
      message = `${savedUser.name} vient de rejoindre la plateforme en tant qu'enseignant`;
      type = NotificationType.TEACHER;
      priority = NotificationPriority.MEDIUM;
      icon = '👨‍🏫';
      actionUrl = `/admin/teachers/${savedUser.id}`;
    }

    if (savedUser.role === UserRole.ADMIN) {
      title = 'Nouvel administrateur ajouté';
      message = `${savedUser.name} a été ajouté comme administrateur`;
      type = NotificationType.SYSTEM;
      priority = NotificationPriority.HIGH;
      icon = '🛡️';
      actionUrl = `/admin/users/${savedUser.id}`;
    }

    await this.adminNotificationsService.create({
      title,
      message,
      type,
      priority,
      icon,
      actionUrl,
    });

    return savedUser;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      relations: ['userBadges', 'userBadges.badge'],
    });
  }

  async findStudents(): Promise<Partial<User>[]> {
    const students = await this.userRepository.find({
      where: { role: UserRole.STUDENT },
      order: { createdAt: 'DESC' },
    });

    return students.map(({ password, refreshToken, ...student }) => student);
  }

  async findTeachers(): Promise<Partial<User>[]> {
    const teachers = await this.userRepository.find({
      where: { role: UserRole.TEACHER },
      order: { createdAt: 'DESC' },
    });

    return teachers.map(({ password, refreshToken, ...teacher }) => teacher);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['userBadges', 'userBadges.badge'],
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['userBadges', 'userBadges.badge'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.name) user.name = dto.name;
    if (dto.email) user.email = dto.email;

    if (dto.password) {
      user.password = await argon2.hash(dto.password);
    }

    if (dto.role) {
      if (dto.role === 'teacher') user.role = UserRole.TEACHER;
      else if (dto.role === 'admin') user.role = UserRole.ADMIN;
      else user.role = UserRole.STUDENT;
    }

    return await this.userRepository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  async updateToken(id: number, token: string): Promise<User> {
    const user = await this.findOne(id);
    user.refreshToken = token;
    return await this.userRepository.save(user);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: Partial<User> }> {
    const user = await this.findByEmail(email);
    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp,
        level: user.level,
        phone: user.phone,
        bio: user.bio,
        language: user.language,
        timezone: user.timezone,
        specializations: user.specializations,
        emailNotifications: user.emailNotifications,
        pushNotifications: user.pushNotifications,
        newMessage: user.newMessage,
        newCourse: user.newCourse,
        systemUpdates: user.systemUpdates,
        weeklyDigest: user.weeklyDigest,
        twoFactorAuth: user.twoFactorAuth,
        sessionTimeout: user.sessionTimeout,
        loginAlerts: user.loginAlerts,
        profileVisibility: user.profileVisibility,
        showEmail: user.showEmail,
        showPhone: user.showPhone,
        showCourses: user.showCourses,
      },
    };
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async addXp(userId: number, xpGain: number) {
    const user = await this.findOne(userId);

    user.xp += Number(xpGain || 0);
    user.level = Math.floor(user.xp / 100) + 1;

    await this.userRepository.save(user);

    let unlockedBadges: Badge[] = [];
    if (user.role === UserRole.STUDENT) {
      unlockedBadges = await this.badgeUnlockService.unlockBadgesForUser(user);
    }

    const refreshedUser = await this.findOne(userId);

    return {
      message: 'XP ajouté avec succès',
      user: {
        id: refreshedUser.id,
        name: refreshedUser.name,
        email: refreshedUser.email,
        role: refreshedUser.role,
        xp: refreshedUser.xp,
        level: refreshedUser.level,
      },
      unlockedBadges,
    };
  }

  async handleFirstDashboardAccess(userId: number): Promise<void> {
    const user = await this.findOne(userId);

    if (user.role === UserRole.STUDENT) {
      await this.badgeUnlockService.assignFirstLoginBadge(user);
    }
  }

  async updateProfile(userId: number, dto: UpdateProfileDto) {
    const user = await this.findOne(userId);

    if (dto.email && dto.email !== user.email) {
      const exists = await this.userRepository.findOne({
        where: { email: dto.email },
      });

      if (exists && exists.id !== user.id) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (dto.name !== undefined) user.name = dto.name;
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.phone !== undefined) user.phone = dto.phone;
    if (dto.bio !== undefined) user.bio = dto.bio;
    if (dto.language !== undefined) user.language = dto.language;
    if (dto.timezone !== undefined) user.timezone = dto.timezone;

    if ((dto as any).specializations !== undefined) {
      user.specializations = (dto as any).specializations;
    }

    const saved = await this.userRepository.save(user);
    const { password, refreshToken, ...result } = saved;
    return result;
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.findOne(userId);

    const isValid = await argon2.verify(user.password, dto.currentPassword);
    if (!isValid) {
      throw new BadRequestException('Mot de passe actuel incorrect');
    }

    user.password = await argon2.hash(dto.newPassword);
    await this.userRepository.save(user);

    return { message: 'Mot de passe modifié avec succès' };
  }

  async updateSettings(userId: number, data: Partial<User>) {
    const user = await this.findOne(userId);

    user.emailNotifications =
      data.emailNotifications ?? user.emailNotifications;
    user.pushNotifications =
      data.pushNotifications ?? user.pushNotifications;
    user.newMessage = data.newMessage ?? user.newMessage;
    user.newCourse = data.newCourse ?? user.newCourse;
    user.systemUpdates = data.systemUpdates ?? user.systemUpdates;
    user.weeklyDigest = data.weeklyDigest ?? user.weeklyDigest;

    user.twoFactorAuth = data.twoFactorAuth ?? user.twoFactorAuth;
    user.sessionTimeout = data.sessionTimeout ?? user.sessionTimeout;
    user.loginAlerts = data.loginAlerts ?? user.loginAlerts;

    user.profileVisibility =
      data.profileVisibility ?? user.profileVisibility;
    user.showEmail = data.showEmail ?? user.showEmail;
    user.showPhone = data.showPhone ?? user.showPhone;
    user.showCourses = data.showCourses ?? user.showCourses;

    const saved = await this.userRepository.save(user);
    const { password, refreshToken, ...result } = saved;
    return result;
  }
}