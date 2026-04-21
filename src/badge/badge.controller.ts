import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBadge } from '../user/entities/user-badge.entity';

@UseGuards(AccessTokenGuard)
@Controller('badge')
export class BadgeController {
  constructor(
    private readonly badgeService: BadgeService,

    @InjectRepository(UserBadge)
    private readonly userBadgeRepository: Repository<UserBadge>,
  ) {}

  @Post()
  async create(@Body() dto: CreateBadgeDto) {
    const badge = await this.badgeService.create(dto);
    return { message: 'badge created', badge };
  }

  @Get()
  async findAll() {
    const badges = await this.badgeService.findAll();
    return { badges };
  }

  @Get('with-status')
  async findAllWithStatus(@Req() req: any) {
    const userId = req.user?.id;

    if (!userId) {
      return { message: 'User not authenticated', badges: [] };
    }

    const allBadges = await this.badgeService.findAll();

    const userBadges = await this.userBadgeRepository.find({
      where: { user: { id: userId } },
      relations: ['badge'],
    });

    const earnedIds = new Set(userBadges.map((ub) => ub.badge.id));

    const badgesWithStatus = allBadges.map((b) => ({
      ...b,
      earned: earnedIds.has(b.id),
    }));

    return { badges: badgesWithStatus };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const badge = await this.badgeService.findOne(id);
    return { badge };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBadgeDto,
  ) {
    const updated = await this.badgeService.update(id, dto);
    return { updatedBadge: updated };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.badgeService.remove(id);
    return { message: 'badge deleted' };
  }
}