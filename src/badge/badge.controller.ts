import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { Badge } from './entities/badge.entity';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  async create(@Body() createBadgeDto: CreateBadgeDto, @Res() response) {
    try {
      const badge = await this.badgeService.create(createBadgeDto);
      return response.status(HttpStatus.CREATED).json({
        message: "badge created successfully",
        badge
      })
    } catch(error) {
      // ✅ Correction : typer error comme une Error
      const err = error as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "failed to create badge: " + err.message,
      })
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const badges = await this.badgeService.findAll();
      return response.status(HttpStatus.OK).json({
        message: "all badges retrieved successfully",
        badges
      })
    } catch(error) {
      const err = error as Error;
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: "failed to retrieve badges: " + err.message,
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response) {
    try {
      const badge = await this.badgeService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message: "badge retrieved successfully",
        badge
      })
    } catch(error) {
      const err = error as Error;
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "failed to retrieve badge: " + err.message,
      })
    }
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateBadgeDto: UpdateBadgeDto, @Res() response) {
    try {
      const updatedBadge = await this.badgeService.update(id, updateBadgeDto);
      return response.status(HttpStatus.OK).json({
        message: "badge updated successfully",
        updatedBadge
      })
    } catch(error) {
      const err = error as Error;
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "failed to update badge: " + err.message,
      })
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number, @Res() response) {
    try {
      await this.badgeService.remove(id);
      return response.status(HttpStatus.OK).json({
        message: "badge deleted successfully",
      })
    } catch(error) {
      const err = error as Error;
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode: 404,
        message: "failed to delete badge: " + err.message,
      })
    }
  }
}