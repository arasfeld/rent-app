'use client';

import {
  Building2,
  Users,
  DollarSign,
  AlertTriangle,
  Calendar,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@repo/ui/components/badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@repo/ui/components/card';
import { formatCurrency } from '@repo/shared/utils';

import {
  useGetDashboardStatsQuery,
  useGetRecentActivityQuery,
} from '@/lib/api';
import { useAuth } from '@/lib/hooks';
import { getStatusVariant } from '@/lib/get-status-variant';
import { StatCard } from '@/components/stat-card';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } =
    useGetDashboardStatsQuery();
  const { data: activity, isLoading: activityLoading } =
    useGetRecentActivityQuery(5);

  const isLoading = statsLoading || activityLoading;

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}!</h1>
        <p className="mt-1 text-muted-foreground">
          Here's what's happening with your properties today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={stats?.totalProperties || 0}
          icon={Building2}
        />
        <StatCard
          title="Active Tenants"
          value={stats?.totalTenants || 0}
          icon={Users}
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(stats?.monthlyRevenue || 0)}
          icon={DollarSign}
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats?.occupancyRate || 0}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Alerts */}
      {((stats?.overduePayments || 0) > 0 ||
        (stats?.upcomingLeaseExpirations || 0) > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(stats?.overduePayments || 0) > 0 && (
            <Card className="border-l-4 border-l-destructive">
              <CardContent>
                <div className="flex items-center">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">Overdue Payments</h3>
                    <p className="text-muted-foreground">
                      {stats?.overduePayments} payment(s) are past due
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          {(stats?.upcomingLeaseExpirations || 0) > 0 && (
            <Card className="border-l-4 border-l-warning">
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-warning" />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">
                      Leases Expiring Soon
                    </h3>
                    <p className="text-muted-foreground">
                      {stats?.upcomingLeaseExpirations} lease(s) expire in the
                      next 30 days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Payments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {activity?.recentPayments && activity.recentPayments.length > 0 ? (
              <div className="space-y-4">
                {activity.recentPayments.slice(0, 5).map((payment: any) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {payment.tenant?.firstName} {payment.tenant?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.property?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(payment.totalAmount)}
                      </p>
                      <Badge variant={getStatusVariant(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No recent payments</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            {activity?.upcomingReminders &&
            activity.upcomingReminders.length > 0 ? (
              <div className="space-y-4">
                {activity.upcomingReminders.slice(0, 5).map((reminder: any) => (
                  <div
                    key={reminder.id}
                    className="flex items-start py-2 border-b last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{reminder.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.description}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground ml-4">
                      {new Date(reminder.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No upcoming reminders</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
