import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('admin/dashboard')
export class AdminDashboardController {
  constructor(private service: AdminDashboardService) {}

  @Get()
  getDashboard() {
    return this.service.getDashboard();
  }
}