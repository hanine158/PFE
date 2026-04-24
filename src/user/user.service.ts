// src/user/user.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // ================= CREATE =================
  async create(createUserDto: CreateUserDto): Promise<User> {
    const data: Partial<User> = {
      ...createUserDto,
      role:
        typeof createUserDto.role === 'string'
          ? (createUserDto.role as UserRole)
          : createUserDto.role,
    };

    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    const user = this.userRepository.create(data);

    // 🔥 FIX ICI
    return await this.userRepository.save<User>(user);
  }

  // ================= ADMIN =================
  async createDefaultAdmin(): Promise<User> {
    const email = 'admin@learnx.com';

    const existing = await this.findUserByEmail(email);
    if (existing) return existing;

    const admin = this.userRepository.create({
      name: 'Admin',
      email,
      password: await argon2.hash('admin123'),
      role: UserRole.ADMIN,
    });

    return await this.userRepository.save<User>(admin);
  }

  // ================= GET =================
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Utilisateur introuvable');
    }

    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save<User>(user);
  }

  // ================= UPDATE =================
  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.findOne(id);

    const data: Partial<User> = {
      ...dto,
      role:
        typeof dto.role === 'string'
          ? (dto.role as UserRole)
          : dto.role,
    };

    if (data.password) {
      data.password = await argon2.hash(data.password);
    }

    await this.userRepository.update(id, data);
    return await this.findOne(id);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete(id);
    return user;
  }

  // ================= FILTER =================
  async findStudents(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: UserRole.STUDENT },
    });
  }

  async findTeachers(): Promise<User[]> {
    return await this.userRepository.find({
      where: { role: UserRole.TEACHER },
    });
  }

  // ================= SEARCH =================
  async searchUsers(q: string) {
    const search = q.trim().toLowerCase();
    if (!search) return [];

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('LOWER(user.name) LIKE :search', { search: `%${search}%` })
      .orWhere('LOWER(user.email) LIKE :search', { search: `%${search}%` })
      .getMany();

    return users.map(({ password, refreshToken, ...u }) => u);
  }

  async searchStudents(q: string) {
    const search = q.trim().toLowerCase();
    if (!search) return [];

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.STUDENT })
      .andWhere(
        '(LOWER(user.name) LIKE :search OR LOWER(user.email) LIKE :search)',
        { search: `%${search}%` },
      )
      .getMany();

    return users.map(({ password, refreshToken, ...u }) => u);
  }

  async searchTeachers(q: string) {
    const search = q.trim().toLowerCase();
    if (!search) return [];

    const users = await this.userRepository
      .createQueryBuilder('user')
      .where('user.role = :role', { role: UserRole.TEACHER })
      .andWhere(
        '(LOWER(user.name) LIKE :search OR LOWER(user.email) LIKE :search)',
        { search: `%${search}%` },
      )
      .getMany();

    return users.map(({ password, refreshToken, ...u }) => u);
  }

  // ================= PROFILE =================
  async updateProfile(userId: number, dto: UpdateProfileDto): Promise<User> {
    await this.userRepository.update(userId, dto as any);
    return await this.findOne(userId);
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const user = await this.findOne(userId);

    const oldPassword =
      (dto as any).oldPassword ||
      (dto as any).currentPassword;

    const newPassword =
      (dto as any).newPassword ||
      (dto as any).password;

    if (!oldPassword || !newPassword) {
      throw new BadRequestException('Mot de passe invalide');
    }

    const valid = await argon2.verify(user.password, oldPassword);

    if (!valid) {
      throw new BadRequestException('Ancien mot de passe incorrect');
    }

    await this.userRepository.update(userId, {
      password: await argon2.hash(newPassword),
    });

    return { message: 'Mot de passe mis à jour' };
  }

  // ================= XP =================
  async addXp(userId: number, xpGain: number) {
    const user = await this.findOne(userId);
    user.xp = (user.xp || 0) + xpGain;
    return await this.userRepository.save(user);
  }

  async handleFirstDashboardAccess(userId: number) {
    return { message: 'OK', userId };
  }

  async updateSettings(userId: number, data: any): Promise<User> {
    await this.userRepository.update(userId, data);
    return await this.findOne(userId);
  }
}