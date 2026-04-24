// src/user/user.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Logger,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) {
    const user = await this.userService.findOne(req.user.id);
    const { password, refreshToken, ...result } = user;
    return { user: result };
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const { password, refreshToken, ...result } = user;
    return { user: result };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return {
      users: users.map(({ password, refreshToken, ...u }) => u),
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('students')
  async getStudents() {
    const students = await this.userService.findStudents();
    return { students };
  }

  @UseGuards(JwtAuthGuard)
  @Get('teachers')
  async getTeachers() {
    const teachers = await this.userService.findTeachers();
    return { teachers };
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  async searchUsers(@Query('q') q: string) {
    const users = await this.userService.searchUsers(q || '');
    return { users };
  }

  @UseGuards(JwtAuthGuard)
  @Get('students/search')
  async searchStudents(@Query('q') q: string) {
    const students = await this.userService.searchStudents(q || '');
    return { students };
  }

  @UseGuards(JwtAuthGuard)
  @Get('teachers/search')
  async searchTeachers(@Query('q') q: string) {
    const teachers = await this.userService.searchTeachers(q || '');
    return { teachers };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    const { password, refreshToken, ...result } = user;
    return { user: result };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.userService.update(id, updateUserDto);
    const { password, refreshToken, ...result } = user;
    return { user: result };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.remove(id);
    const { password, refreshToken, ...result } = user;
    return { deletedUser: result };
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-xp')
  async addXp(@Request() req: any, @Body('xpGain') xpGain: number) {
    return await this.userService.addXp(req.user.id, Number(xpGain || 0));
  }

  @UseGuards(JwtAuthGuard)
  @Post('first-dashboard')
  async firstDashboardAccess(@Request() req: any) {
    return await this.userService.handleFirstDashboardAccess(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/update')
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    const user = await this.userService.updateProfile(req.user.id, dto);
    const { password, refreshToken, ...result } = user;
    return { user: result };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/change-password')
  async updatePassword(@Request() req: any, @Body() dto: UpdatePasswordDto) {
    return await this.userService.updatePassword(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/settings')
  async updateSettings(@Request() req: any, @Body() data: any) {
    const user = await this.userService.updateSettings(req.user.id, data);
    const { password, refreshToken, ...result } = user;
    return { user: result };
  }
}