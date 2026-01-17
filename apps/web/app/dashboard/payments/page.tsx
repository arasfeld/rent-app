'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { paymentsApi } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { Badge, getStatusVariant } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import { DollarSign, Plus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@repo/shared/utils';

export default function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      Promise.all([
        paymentsApi.getAll(token),
        paymentsApi.getSummary(token),
      ])
        .then(([paymentsResponse, summaryData]) => {
          setPayments(paymentsResponse.data);
          setSummary(summaryData);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const columns = [
    {
      key: 'tenant',
      header: 'Tenant',
      render: (payment: any) => (
        <div>
          <p className="font-medium">
            {payment.tenant?.firstName} {payment.tenant?.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{payment.property?.name}</p>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (payment: any) => (
        <span className="capitalize">{payment.type.toLowerCase().replace('_', ' ')}</span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (payment: any) => (
        <span className="font-medium">{formatCurrency(payment.totalAmount)}</span>
      ),
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (payment: any) => (
        <span>{formatDate(payment.dueDate)}</span>
      ),
    },
    {
      key: 'paidDate',
      header: 'Paid Date',
      render: (payment: any) => (
        <span>{payment.paidDate ? formatDate(payment.paidDate) : '-'}</span>
      ),
    },
    {
      key: 'method',
      header: 'Method',
      render: (payment: any) => (
        <span className="capitalize">
          {payment.method?.toLowerCase().replace('_', ' ') || '-'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (payment: any) => (
        <Badge variant={getStatusVariant(payment.status)}>
          {payment.status}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payments</h1>
          <p className="mt-1 text-muted-foreground">
            Track and manage rent payments
          </p>
        </div>
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          Record Payment
        </button>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Collected This Month"
          value={formatCurrency(summary?.totalCollected || 0)}
          icon={CheckCircle}
        />
        <StatCard
          title="Payments This Month"
          value={summary?.paymentsThisMonth || 0}
          icon={DollarSign}
        />
        <StatCard
          title="Pending"
          value={formatCurrency(summary?.totalPending || 0)}
          icon={Clock}
        />
        <StatCard
          title="Overdue"
          value={formatCurrency(summary?.totalOverdue || 0)}
          icon={AlertTriangle}
        />
      </div>

      {/* Payments Table */}
      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(payment) => payment.id}
        emptyMessage="No payments recorded yet."
      />
    </div>
  );
}
