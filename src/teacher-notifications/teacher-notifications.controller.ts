import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { TeacherNotificationsService } from './teacher-notifications.service';
import { CreateTeacherNotificationDto } from './dto/create-teacher-notification.dto';
import { UpdateTeacherNotificationDto } from './dto/update-teacher-notification.dto';

@Controller('teacher-notifications')
export class TeacherNotificationsController {
  constructor(private readonly teacherNotificationsService: TeacherNotificationsService) {}

  @Post()
  create(@Body() createTeacherNotificationDto: CreateTeacherNotificationDto) {
    return this.teacherNotificationsService.create(createTeacherNotificationDto);
  }

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.teacherNotificationsService.findAll(userId ? Number(userId) : undefined);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.teacherNotificationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTeacherNotificationDto: UpdateTeacherNotificationDto,
  ) {
    return this.teacherNotificationsService.update(id, updateTeacherNotificationDto);
  }

  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.teacherNotificationsService.markAsRead(id);
  }

  @Patch('read-all/:userId')
  markAllAsRead(@Param('userId', ParseIntPipe) userId: number) {
    return this.teacherNotificationsService.markAllAsRead(userId);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.teacherNotificationsService.remove(id);
  }
}