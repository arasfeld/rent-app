import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTenantDto, UpdateTenantDto, TenantQueryDto } from './dto/tenant.dto';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateTenantDto) {
    return this.prisma.tenant.create({
      data: {
        ownerId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        emergencyContactName: dto.emergencyContact?.name,
        emergencyContactPhone: dto.emergencyContact?.phone,
        emergencyContactEmail: dto.emergencyContact?.email,
        emergencyRelationship: dto.emergencyContact?.relationship,
        employer: dto.employmentInfo?.employer,
        employerPosition: dto.employmentInfo?.position,
        monthlyIncome: dto.employmentInfo?.monthlyIncome,
        employerPhone: dto.employmentInfo?.employerPhone,
        employerAddress: dto.employmentInfo?.employerAddress,
        notes: dto.notes,
      },
    });
  }

  async findAll(ownerId: string, query: TenantQueryDto) {
    const { page = 1, limit = 10, status, search, hasActiveLease } = query;
    const skip = (page - 1) * limit;

    const where: any = { ownerId };

    if (status) where.status = status;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (hasActiveLease !== undefined) {
      where.leases = hasActiveLease
        ? { some: { status: 'ACTIVE' } }
        : { none: { status: 'ACTIVE' } };
    }

    const [data, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          leases: {
            where: { status: 'ACTIVE' },
            include: { property: true },
          },
        },
      }),
      this.prisma.tenant.count({ where }),
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
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, ownerId },
      include: {
        leases: {
          include: {
            property: true,
            payments: {
              orderBy: { dueDate: 'desc' },
              take: 10,
            },
          },
        },
      },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return tenant;
  }

  async update(ownerId: string, id: string, dto: UpdateTenantDto) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, ownerId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.update({
      where: { id },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        status: dto.status,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        emergencyContactName: dto.emergencyContact?.name,
        emergencyContactPhone: dto.emergencyContact?.phone,
        emergencyContactEmail: dto.emergencyContact?.email,
        emergencyRelationship: dto.emergencyContact?.relationship,
        employer: dto.employmentInfo?.employer,
        employerPosition: dto.employmentInfo?.position,
        monthlyIncome: dto.employmentInfo?.monthlyIncome,
        employerPhone: dto.employmentInfo?.employerPhone,
        employerAddress: dto.employmentInfo?.employerAddress,
        notes: dto.notes,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    const tenant = await this.prisma.tenant.findFirst({
      where: { id, ownerId },
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return this.prisma.tenant.delete({ where: { id } });
  }
}
