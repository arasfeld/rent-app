import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeaseDto, UpdateLeaseDto, LeaseQueryDto } from './dto/lease.dto';

@Injectable()
export class LeasesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateLeaseDto) {
    // Verify property belongs to owner
    const property = await this.prisma.property.findFirst({
      where: { id: dto.propertyId, ownerId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    // Verify tenant belongs to owner
    const tenant = await this.prisma.tenant.findFirst({
      where: { id: dto.tenantId, ownerId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Check for active leases on this property
    const existingLease = await this.prisma.lease.findFirst({
      where: {
        propertyId: dto.propertyId,
        status: 'ACTIVE',
      },
    });

    if (existingLease) {
      throw new BadRequestException('Property already has an active lease');
    }

    // Create the lease
    const lease = await this.prisma.lease.create({
      data: {
        propertyId: dto.propertyId,
        tenantId: dto.tenantId,
        ownerId,
        type: dto.type,
        status: 'ACTIVE',
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        monthlyRent: dto.monthlyRent,
        securityDeposit: dto.securityDeposit,
        lateFeeAmount: dto.lateFeeAmount,
        lateFeeGracePeriodDays: dto.lateFeeGracePeriodDays,
        paymentDueDay: dto.paymentDueDay || 1,
        terms: dto.terms,
      },
      include: {
        property: true,
        tenant: true,
      },
    });

    // Update property status to occupied
    await this.prisma.property.update({
      where: { id: dto.propertyId },
      data: { status: 'OCCUPIED' },
    });

    // Update tenant status to active
    await this.prisma.tenant.update({
      where: { id: dto.tenantId },
      data: { status: 'ACTIVE' },
    });

    return lease;
  }

  async findAll(ownerId: string, query: LeaseQueryDto) {
    const { page = 1, limit = 10, status, type, propertyId, tenantId } = query;
    const skip = (page - 1) * limit;

    const where: any = { ownerId };

    if (status) where.status = status;
    if (type) where.type = type;
    if (propertyId) where.propertyId = propertyId;
    if (tenantId) where.tenantId = tenantId;

    const [data, total] = await Promise.all([
      this.prisma.lease.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          property: true,
          tenant: true,
        },
      }),
      this.prisma.lease.count({ where }),
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
    const lease = await this.prisma.lease.findFirst({
      where: { id, ownerId },
      include: {
        property: true,
        tenant: true,
        payments: {
          orderBy: { dueDate: 'desc' },
        },
        documents: true,
      },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    return lease;
  }

  async update(ownerId: string, id: string, dto: UpdateLeaseDto) {
    const lease = await this.prisma.lease.findFirst({
      where: { id, ownerId },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    const updated = await this.prisma.lease.update({
      where: { id },
      data: {
        type: dto.type,
        status: dto.status,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        monthlyRent: dto.monthlyRent,
        securityDeposit: dto.securityDeposit,
        securityDepositPaid: dto.securityDepositPaid,
        lateFeeAmount: dto.lateFeeAmount,
        lateFeeGracePeriodDays: dto.lateFeeGracePeriodDays,
        paymentDueDay: dto.paymentDueDay,
        terms: dto.terms,
      },
      include: {
        property: true,
        tenant: true,
      },
    });

    // If lease is terminated or expired, update property status
    if (dto.status === 'TERMINATED' || dto.status === 'EXPIRED') {
      await this.prisma.property.update({
        where: { id: lease.propertyId },
        data: { status: 'AVAILABLE' },
      });
    }

    return updated;
  }

  async remove(ownerId: string, id: string) {
    const lease = await this.prisma.lease.findFirst({
      where: { id, ownerId },
    });

    if (!lease) {
      throw new NotFoundException('Lease not found');
    }

    // Update property status
    await this.prisma.property.update({
      where: { id: lease.propertyId },
      data: { status: 'AVAILABLE' },
    });

    return this.prisma.lease.delete({ where: { id } });
  }
}
