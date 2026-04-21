import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findMine(@Request() req: any) {
    const notifications = await this.notificationService.findAllForUser(
      req.user.id,
    );

    const stats = await this.notificationService.getStats(req.user.id);

    return {
      notifications,
      stats,
    };
  }

  @Post()
  async createMine(@Request() req: any, @Body() dto: CreateNotificationDto) {
    const notification = await this.notificationService.createForUser(
      req.user.id,
      dto,
    );

    return { notification };
  }

  @Patch('read-all')
  async markAllAsRead(@Request() req: any) {
    return await this.notificationService.markAllAsRead(req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const notification = await this.notificationService.markAsRead(
      req.user.id,
      id,
    );

    return { notification };
  }

  @Delete(':id')
  async deleteOne(
    @Request() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.notificationService.deleteOne(req.user.id, id);
  }

  @Delete()
  async deleteAll(@Request() req: any) {
    return await this.notificationService.deleteAll(req.user.id);
  }
}