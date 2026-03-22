import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // Création d'un utilisateur
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Vérifie si l'email existe déjà
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const newUser = this.userRepository.create(createUserDto as DeepPartial<User>);
    return await this.userRepository.save(newUser);
  }

  // Récupérer tous les utilisateurs
  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    if (users.length === 0) {
      throw new NotFoundException("No users found");
    }
    return users;
  }

  // Récupérer un utilisateur par ID
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  // Récupérer un utilisateur par email
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // Mettre à jour un utilisateur
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...updateUserDto as DeepPartial<User>,
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return await this.userRepository.save(user);
  }

  // Supprimer un utilisateur
  async remove(id: number): Promise<User> {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  // Mettre à jour le refresh token
  async updateToken(id: number, token: string): Promise<User> {
    const updateResult = await this.userRepository.update(id, { refreshToken: token });
    if (updateResult.affected === 0) {
      throw new NotFoundException('User not found');
    }
    return this.findOne(id);
  }

  // Validation login (hash password)
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password');
    }
    return user;
  }

  // Sauvegarder un utilisateur (utile pour refresh token ou updates)
  async saveUser(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }
}