import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { UpdateAdminSettingsDto } from './dto/update-admin-setting.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('admin/settings')
export class AdminSettingsController {
  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get()
  async getSettings() {
    return await this.adminSettingsService.getSettings();
  }

  @Patch()
  async updateSettings(@Body() dto: UpdateAdminSettingsDto) {
    return await this.adminSettingsService.updateSettings(dto);
  }

  @Post('backup')
  async runBackup() {
    return await this.adminSettingsService.runBackup();
  }
}