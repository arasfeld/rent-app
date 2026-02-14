import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(ownerId: string) {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysFromNow = new Date(
      now.getTime() + 30 * 24 * 60 * 60 * 1000
    );

    const [
      totalProperties,
      occupiedProperties,
      totalTenants,
      activeLeases,
      monthlyRevenue,
      overduePayments,
      upcomingLeaseExpirations,
    ] = await Promise.all([
      // Total properties
      this.prisma.property.count({ where: { ownerId } }),

      // Occupied properties
      this.prisma.property.count({ where: { ownerId, status: 'OCCUPIED' } }),

      // Total tenants
      this.prisma.tenant.count({ where: { ownerId, status: 'ACTIVE' } }),

      // Active leases
      this.prisma.lease.count({ where: { ownerId, status: 'ACTIVE' } }),

      // Monthly revenue (completed payments this month)
      this.prisma.payment.aggregate({
        where: {
          ownerId,
          status: 'COMPLETED',
          paidDate: {
            gte: startOfMonth,
          },
        },
        _sum: { totalAmount: true },
      }),

      // Overdue payments
      this.prisma.payment.count({
        where: {
          ownerId,
          status: 'PENDING',
          dueDate: { lt: now },
        },
      }),

      // Leases expiring in next 30 days
      this.prisma.lease.count({
        where: {
          ownerId,
          status: 'ACTIVE',
          endDate: {
            gte: now,
            lte: thirtyDaysFromNow,
          },
        },
      }),
    ]);

    const occupancyRate =
      totalProperties > 0
        ? Math.round((occupiedProperties / totalProperties) * 100)
        : 0;

    return {
      totalProperties,
      totalTenants,
      activeLeases,
      monthlyRevenue: monthlyRevenue._sum.totalAmount || 0,
      occupancyRate,
      overduePayments,
      upcomingLeaseExpirations,
    };
  }

  async getRecentActivity(ownerId: string, limit = 10) {
    const [recentPayments, recentLeases, upcomingReminders] = await Promise.all(
      [
        // Recent payments
        this.prisma.payment.findMany({
          where: { ownerId },
          orderBy: { updatedAt: 'desc' },
          take: limit,
          include: {
            tenant: { select: { firstName: true, lastName: true } },
            property: { select: { name: true } },
          },
        }),

        // Recent lease activity
        this.prisma.lease.findMany({
          where: { ownerId },
          orderBy: { updatedAt: 'desc' },
          take: limit,
          include: {
            tenant: { select: { firstName: true, lastName: true } },
            property: { select: { name: true } },
          },
        }),

        // Upcoming reminders
        this.prisma.reminder.findMany({
          where: {
            ownerId,
            isCompleted: false,
            dueDate: { gte: new Date() },
          },
          orderBy: { dueDate: 'asc' },
          take: limit,
        }),
      ]
    );

    return {
      recentPayments,
      recentLeases,
      upcomingReminders,
    };
  }

  async getFinancialSummary(ownerId: string) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Get monthly revenue for the current year
    const payments = await this.prisma.payment.findMany({
      where: {
        ownerId,
        status: 'COMPLETED',
        paidDate: { gte: startOfYear },
      },
      select: {
        totalAmount: true,
        paidDate: true,
      },
    });

    // Group by month
    const monthlyData: Record<number, number> = {};
    for (let i = 0; i < 12; i++) {
      monthlyData[i] = 0;
    }

    payments.forEach((payment) => {
      if (payment.paidDate) {
        const month = payment.paidDate.getMonth();
        monthlyData[month] = (monthlyData[month] || 0) + payment.totalAmount;
      }
    });

    const monthlyRevenue = Object.entries(monthlyData).map(
      ([month, amount]) => ({
        month: parseInt(month),
        amount,
      })
    );

    // Calculate totals
    const yearToDateRevenue = payments.reduce(
      (sum, p) => sum + p.totalAmount,
      0
    );
    const currentMonthPayments = payments.filter(
      (p) => p.paidDate && p.paidDate.getMonth() === now.getMonth()
    );
    const currentMonthRevenue = currentMonthPayments.reduce(
      (sum, p) => sum + p.totalAmount,
      0
    );

    return {
      yearToDateRevenue,
      currentMonthRevenue,
      monthlyRevenue,
    };
  }
}
