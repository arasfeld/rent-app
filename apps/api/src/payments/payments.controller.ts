import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentQueryDto, RecordPaymentDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@CurrentUser('id') userId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(userId, dto);
  }

  @Post('record')
  recordPayment(@CurrentUser('id') userId: string, @Body() dto: RecordPaymentDto) {
    return this.paymentsService.recordPayment(userId, dto);
  }

  @Get('summary')
  getSummary(@CurrentUser('id') userId: string) {
    return this.paymentsService.getSummary(userId);
  }

  @Get()
  findAll(@CurrentUser('id') userId: string, @Query() query: PaymentQueryDto) {
    return this.paymentsService.findAll(userId, query);
  }

  @Get(':id')
  findOne(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.paymentsService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(userId, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    return this.paymentsService.remove(userId, id);
  }
}
