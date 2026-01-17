import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto, UpdatePaymentDto, PaymentQueryDto, RecordPaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreatePaymentDto) {
    // Verify lease belongs to owner
    const lease = await this.prisma.lease.findFirst({
      where: { id: dto.leaseId, ownerId },
      include: { property: true, tenant: true },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    const totalAmount = dto.amount + (dto.lateFee || 0);

    return this.prisma.payment.create({
      data: {
        leaseId: dto.leaseId,
        tenantId: lease.tenantId,
        propertyId: lease.propertyId,
        ownerId,
        type: dto.type,
        status: 'PENDING',
        amount: dto.amount,
        lateFee: dto.lateFee,
        totalAmount,
        method: dto.method,
        dueDate: new Date(dto.dueDate),
        paidDate: dto.paidDate ? new Date(dto.paidDate) : undefined,
        periodStart: dto.periodStart ? new Date(dto.periodStart) : undefined,
        periodEnd: dto.periodEnd ? new Date(dto.periodEnd) : undefined,
        notes: dto.notes,
      },
      include: {
        lease: true,
        tenant: true,
        property: true,
      },
    });
  }

  async recordPayment(ownerId: string, dto: RecordPaymentDto) {
    // Verify lease belongs to owner
    const lease = await this.prisma.lease.findFirst({
      where: { id: dto.leaseId, ownerId },
      include: { property: true, tenant: true },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    // Find pending payment for this lease or create new one
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let payment = await this.prisma.payment.findFirst({
      where: {
        leaseId: dto.leaseId,
        status: 'PENDING',
        type: 'RENT',
      },
      orderBy: { dueDate: 'asc' },
    });

    if (payment) {
      // Update existing payment
      return this.prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'COMPLETED',
          amount: dto.amount,
          totalAmount: dto.amount,
          method: dto.method,
          paidDate: dto.paidDate ? new Date(dto.paidDate) : now,
          notes: dto.notes,
        },
        include: {
          lease: true,
          tenant: true,
          property: true,
        },
      });
    }

    // Create new completed payment
    return this.prisma.payment.create({
      data: {
        leaseId: dto.leaseId,
        tenantId: lease.tenantId,
        propertyId: lease.propertyId,
        ownerId,
        type: 'RENT',
        status: 'COMPLETED',
        amount: dto.amount,
        totalAmount: dto.amount,
        method: dto.method,
        dueDate: periodStart,
        paidDate: dto.paidDate ? new Date(dto.paidDate) : now,
        periodStart,
        periodEnd,
        notes: dto.notes,
      },
      include: {
        lease: true,
        tenant: true,
        property: true,
      },
    });
  }

  async findAll(ownerId: string, query: PaymentQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      method,
      leaseId,
      tenantId,
      propertyId,
      dueDateFrom,
      dueDateTo,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { ownerId };

    if (status) where.status = status;
    if (type) where.type = type;
    if (method) where.method = method;
    if (leaseId) where.leaseId = leaseId;
    if (tenantId) where.tenantId = tenantId;
    if (propertyId) where.propertyId = propertyId;
    if (dueDateFrom || dueDateTo) {
      where.dueDate = {};
      if (dueDateFrom) where.dueDate.gte = new Date(dueDateFrom);
      if (dueDateTo) where.dueDate.lte = new Date(dueDateTo);
    }

    const [data, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { dueDate: 'desc' },
        include: {
          lease: true,
          tenant: true,
          property: true,
        },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(ownerId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, ownerId },
      include: {
        lease: true,
        tenant: true,
        property: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async update(ownerId: string, id: string, dto: UpdatePaymentDto) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, ownerId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const totalAmount = (dto.amount ?? payment.amount) + (dto.lateFee ?? payment.lateFee ?? 0);

    return this.prisma.payment.update({
      where: { id },
      data: {
        status: dto.status,
        amount: dto.amount,
        lateFee: dto.lateFee,
        totalAmount: dto.amount !== undefined || dto.lateFee !== undefined ? totalAmount : undefined,
        method: dto.method,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        paidDate: dto.paidDate ? new Date(dto.paidDate) : undefined,
        transactionId: dto.transactionId,
        notes: dto.notes,
      },
      include: {
        lease: true,
        tenant: true,
        property: true,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    const payment = await this.prisma.payment.findFirst({
      where: { id, ownerId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.prisma.payment.delete({ where: { id } });
  }

  async getSummary(ownerId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [completed, pending, overdue] = await Promise.all([
      this.prisma.payment.aggregate({
        where: {
          ownerId,
          status: 'COMPLETED',
          paidDate: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: {
          ownerId,
          status: 'PENDING',
          dueDate: {
            gte: now,
          },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
      this.prisma.payment.aggregate({
        where: {
          ownerId,
          status: 'PENDING',
          dueDate: {
            lt: now,
          },
        },
        _sum: { totalAmount: true },
        _count: true,
      }),
    ]);

    return {
      totalCollected: completed._sum.totalAmount || 0,
      totalPending: pending._sum.totalAmount || 0,
      totalOverdue: overdue._sum.totalAmount || 0,
      paymentsThisMonth: completed._count,
      overdueCount: overdue._count,
    };
  }
}
