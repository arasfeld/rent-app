import { Controller, Get, Query, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@CurrentUser('id') userId: string) {
    return this.dashboardService.getStats(userId);
  }

  @Get('recent-activity')
  getRecentActivity(
    @CurrentUser('id') userId: string,
    @Query('limit') limit?: string
  ) {
    return this.dashboardService.getRecentActivity(
      userId,
      limit ? parseInt(limit) : 10
    );
  }

  @Get('financial-summary')
  getFinancialSummary(@CurrentUser('id') userId: string) {
    return this.dashboardService.getFinancialSummary(userId);
  }
}
