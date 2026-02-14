import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import {
  CreatePropertyDto,
  UpdatePropertyDto,
  PropertyQueryDto,
} from './dto/property.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreatePropertyDto) {
    return this.prisma.property.create({
      data: {
        ownerId,
        name: dto.name,
        type: dto.type,
        street: dto.address.street,
        unit: dto.address.unit,
        city: dto.address.city,
        state: dto.address.state,
        zipCode: dto.address.zipCode,
        country: dto.address.country || 'USA',
        units: dto.units || 1,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        squareFeet: dto.squareFeet,
        yearBuilt: dto.yearBuilt,
        description: dto.description,
        amenities: dto.amenities || [],
        monthlyRent: dto.monthlyRent,
        securityDeposit: dto.securityDeposit,
      },
    });
  }

  async findAll(ownerId: string, query: PropertyQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      city,
      minRent,
      maxRent,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = { ownerId };

    if (status) where.status = status;
    if (type) where.type = type;
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (minRent) where.monthlyRent = { ...where.monthlyRent, gte: minRent };
    if (maxRent) where.monthlyRent = { ...where.monthlyRent, lte: maxRent };

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          leases: {
            where: { status: 'ACTIVE' },
            include: { tenant: true },
          },
        },
      }),
      this.prisma.property.count({ where }),
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
    const property = await this.prisma.property.findFirst({
      where: { id, ownerId },
      include: {
        leases: {
          include: {
            tenant: true,
            payments: {
              orderBy: { dueDate: 'desc' },
              take: 5,
            },
          },
        },
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return property;
  }

  async update(ownerId: string, id: string, dto: UpdatePropertyDto) {
    const property = await this.prisma.property.findFirst({
      where: { id, ownerId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.property.update({
      where: { id },
      data: {
        name: dto.name,
        type: dto.type,
        status: dto.status,
        street: dto.address?.street,
        unit: dto.address?.unit,
        city: dto.address?.city,
        state: dto.address?.state,
        zipCode: dto.address?.zipCode,
        country: dto.address?.country,
        units: dto.units,
        bedrooms: dto.bedrooms,
        bathrooms: dto.bathrooms,
        squareFeet: dto.squareFeet,
        yearBuilt: dto.yearBuilt,
        description: dto.description,
        amenities: dto.amenities,
        monthlyRent: dto.monthlyRent,
        securityDeposit: dto.securityDeposit,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id, ownerId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    return this.prisma.property.delete({ where: { id } });
  }
}
