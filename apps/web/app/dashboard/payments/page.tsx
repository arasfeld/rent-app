'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { paymentsApi } from '@/lib/api';
import { DataTable } from '@repo/ui/components/data-table';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { StatCard } from '@/components/stat-card';
import { getStatusVariant } from '@/lib/get-status-variant';
import {
  DollarSign,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@repo/shared/utils';
import { ColumnDef } from '@tanstack/react-table';

export default function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      Promise.all([paymentsApi.getAll(token), paymentsApi.getSummary(token)])
        .then(([paymentsResponse, summaryData]) => {
          setPayments(paymentsResponse.data);
          setSummary(summaryData);
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const columns: ColumnDef<any>[] = [
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <div>
          <p className="font-medium">
            {row.original.tenant?.firstName} {row.original.tenant?.lastName}
          </p>
          <p className="text-sm text-muted-foreground">
            {row.original.property?.name}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.type.toLowerCase().replace('_', ' ')}
        </span>
      ),
    },
    {
      id: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCurrency(row.original.totalAmount)}
        </span>
      ),
    },
    {
      accessorKey: 'dueDate',
      header: 'Due Date',
      cell: ({ row }) => <span>{formatDate(row.original.dueDate)}</span>,
    },
    {
      accessorKey: 'paidDate',
      header: 'Paid Date',
      cell: ({ row }) => (
        <span>
          {row.original.paidDate ? formatDate(row.original.paidDate) : '-'}
        </span>
      ),
    },
    {
      accessorKey: 'method',
      header: 'Method',
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.method?.toLowerCase().replace('_', ' ') || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
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
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Record Payment
        </Button>
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
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
