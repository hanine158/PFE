import { Body, Controller, Get, Param, Post, Put, Delete, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('user') // Changed from 'users' to 'user'
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Créer un nouvel utilisateur
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.userService.create(createUserDto);
  }

  // Récupérer tous les utilisateurs
  @Get()
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  // Récupérer un utilisateur par ID
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<User> {
    return await this.userService.findOne(id);
  }

  // Mettre à jour un utilisateur
  @Put(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<User> {
    return await this.userService.update(id, updateUserDto);
  }

  // Supprimer un utilisateur
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<User> {
    return await this.userService.remove(id);
  }

  // Login
  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<User> {
    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }
    return await this.userService.validateUser(email, password);
  }

  // Mettre à jour refresh token
  @Put('refresh-token/:id')
  async updateToken(@Param('id') id: number, @Body() body: { token: string }): Promise<User> {
    const { token } = body;
    return await this.userService.updateToken(id, token);
  }
}