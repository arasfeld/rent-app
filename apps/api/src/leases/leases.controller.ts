import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { LeasesService } from './leases.service';
import { CreateLeaseDto, UpdateLeaseDto, LeaseQueryDto } from './dto/lease.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('leases')
@UseGuards(JwtAuthGuard)
export class LeasesController {
  constructor(private readonly leasesService: LeasesService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreateLeaseDto) {
    return this.leasesService.create(userId, dto);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query() query: LeaseQueryDto) {
    return this.leasesService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.leasesService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateLeaseDto,
  ) {
    return this.leasesService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.leasesService.remove(userId, id);
  }
}
