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
    this.logger.log(`Requête profile pour userId: ${req.user.id}`);
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
    await this.userService.handleFirstDashboardAccess(req.user.id);
    return { message: 'Dashboard access handled' };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/update')
  async updateProfile(@Request() req: any, @Body() dto: UpdateProfileDto) {
    const user = await this.userService.updateProfile(req.user.id, dto);
    return { user };
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
    return { user };
  }
}