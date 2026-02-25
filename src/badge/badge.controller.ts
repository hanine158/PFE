import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { BadgeService } from './badge.service';
import { CreateBadgeDto } from './dto/create-badge.dto';
import { UpdateBadgeDto } from './dto/update-badge.dto';
import { response } from 'express';
import { error } from 'console';
import { Badge } from './entities/badge.entity';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';
 @UseGuards(AccessTokenGuard)


@Controller('badge')
export class BadgeController {
  constructor(private readonly badgeService: BadgeService) {}

  @Post()
  async create(@Body() createBadgeDto: CreateBadgeDto , @Res() response):Promise<Badge> {
    try {
      const badge = await this.badgeService.create(createBadgeDto);
      return response.status(HttpStatus.CREATED).json({
        message:"badge created successfully",
        badge
      })
    }catch(error){
      return response.status(HttpStatus.BAD_REQUEST).json({
         statusCode:400,
        message:"failed to create badge"+error.message,
      })
    }
  }

  @Get()
   async findAll(@Res() response) {
    try {
      const badges = await this.badgeService.findAll();
      return response.status(HttpStatus.OK).json({
        message:"all badges retrieved successfully",
        badges
      })
    } catch(error) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode:400,
        message:"failed to retrieve badges"+error.message,
      })
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() response) {
    try {
      const badge = await this.badgeService.findOne(id);
      return response.status(HttpStatus.OK).json({
        message:"badge retrieved successfully",
        badge
      })
    } catch(error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode:404,
        message:"failed to retrieve badge"+error.message,
      })
    }
  }

  @Patch(':id')
   async update(@Param('id') id: number, @Body() updateBadgeDto: UpdateBadgeDto, @Res() response) {
    try {
      const updatedBadge = await this.badgeService.update(id, updateBadgeDto);
      return response.status(HttpStatus.OK).json({
        message:"badge updated successfully",
        updatedBadge
      })
    } catch(error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode:404,
        message:"failed to update badge"+error.message,
      })
    }
  }

  @Delete(':id')
   async remove(@Param('id') id: number, @Res() response) {
    try {
      await this.badgeService.remove(id);
      return response.status(HttpStatus.OK).json({
        message:"badge deleted successfully",
      })
    } catch(error) {
      return response.status(HttpStatus.NOT_FOUND).json({
        statusCode:404,
        message:"failed to delete badge"+error.message,
      })
    }
  }
}
