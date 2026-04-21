import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { AdminNotificationsService } from './admin-notifications.service';
import { CreateAdminNotificationDto } from './dto/create-admin-notification.dto';
import { UpdateAdminNotificationDto } from './dto/update-admin-notification.dto';

@Controller('admin/notifications')
export class AdminNotificationsController {
  constructor(
    private readonly adminNotificationsService: AdminNotificationsService,
  ) {}

  @Post()
  create(@Body() createAdminNotificationDto: CreateAdminNotificationDto) {
    return this.adminNotificationsService.create(createAdminNotificationDto);
  }

  @Get()
  findAll(@Query('status') status?: string) {
    return this.adminNotificationsService.findAll(status);
  }

  @Get('stats')
  getStats() {
    return this.adminNotificationsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.adminNotificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminNotificationDto: UpdateAdminNotificationDto,
  ) {
    return this.adminNotificationsService.update(id, updateAdminNotificationDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.adminNotificationsService.markAsRead(id);
  }

  @Patch('read-all/all')
  markAllAsRead() {
    return this.adminNotificationsService.markAllAsRead();
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.adminNotificationsService.remove(id);
  }

  @Delete('read/all')
  removeAllRead() {
    return this.adminNotificationsService.removeAllRead();
  }
}