'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useCallback, useEffect, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@repo/shared/utils';

import { useAuth } from '@/lib/auth-context';
import { leasesApi, paymentsApi } from '@/lib/api';
import { DataTable } from '@repo/ui/components/data-table';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { StatCard } from '@/components/stat-card';
import { PaymentModal } from '@/components/modals/payment-modal';
import { DeleteConfirmModal } from '@/components/modals/delete-confirm-modal';
import { getStatusVariant } from '@/lib/get-status-variant';
import {
  cleanPaymentData,
  type PaymentFormData,
} from '@/lib/validations/payment';

interface Payment {
  id: string;
  leaseId: string;
  type: string;
  status: string;
  amount: number;
  totalAmount: number;
  lateFee?: number;
  method?: string;
  dueDate: string;
  paidDate?: string;
  periodStart?: string;
  periodEnd?: string;
  notes?: string;
  tenant?: {
    firstName: string;
    lastName: string;
  };
  property?: {
    name: string;
  };
}

interface Lease {
  id: string;
  status: string;
  monthlyRent: number;
  property?: {
    name: string;
  };
  tenant?: {
    firstName: string;
    lastName: string;
  };
}

interface Summary {
  totalCollected?: number;
  paymentsThisMonth?: number;
  totalPending?: number;
  totalOverdue?: number;
}

export default function PaymentsPage() {
  const { token } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [leases, setLeases] = useState<Lease[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [deletingPayment, setDeletingPayment] = useState<Payment | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!token) return;
    try {
      const [paymentsRes, summaryRes, leasesRes] = await Promise.all([
        paymentsApi.getAll(token),
        paymentsApi.getSummary(token),
        leasesApi.getAll(token),
      ]);
      setPayments(paymentsRes.data);
      setSummary(summaryRes);
      // Only include active leases for the form
      setLeases(leasesRes.data.filter((l: Lease) => l.status === 'ACTIVE'));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreate = () => {
    setEditingPayment(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (payment: Payment) => {
    setEditingPayment(payment);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (payment: Payment) => {
    setDeletingPayment(payment);
  };

  const handleSubmit = async (data: PaymentFormData) => {
    if (!token) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const cleanedData = cleanPaymentData(data);
      if (editingPayment) {
        await paymentsApi.update(token, editingPayment.id, cleanedData);
      } else {
        await paymentsApi.create(token, cleanedData);
      }
      setIsModalOpen(false);
      setEditingPayment(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!token || !deletingPayment) return;
    setIsDeleting(true);
    try {
      await paymentsApi.delete(token, deletingPayment.id);
      setDeletingPayment(null);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Payment>[] = [
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
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(row.original);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(row.original);
            }}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
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
        <Button onClick={handleCreate}>
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

      {/* Payment Modal */}
      <PaymentModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingPayment(null);
            setError(null);
          }
        }}
        payment={editingPayment}
        leases={leases}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deletingPayment}
        onOpenChange={(open) => {
          if (!open) setDeletingPayment(null);
        }}
        title="Delete Payment"
        description="Are you sure you want to delete this payment record? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
