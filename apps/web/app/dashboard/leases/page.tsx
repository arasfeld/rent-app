'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Calendar, FileText, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DataTable } from '@repo/ui/components/data-table';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';

import { useAuth } from '@/lib/auth-context';
import { leasesApi } from '@/lib/api';
import { getStatusVariant } from '@/lib/get-status-variant';
import { formatCurrency, formatDate } from '@repo/shared/utils';

export default function LeasesPage() {
  const { token } = useAuth();
  const [leases, setLeases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      leasesApi
        .getAll(token)
        .then((response) => setLeases(response.data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const columns: ColumnDef<any>[] = [
    {
      id: 'property',
      header: 'Property',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <p className="font-medium">{row.original.property?.name}</p>
            <p className="text-sm text-muted-foreground">
              {row.original.property?.city}, {row.original.property?.state}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'tenant',
      header: 'Tenant',
      cell: ({ row }) => (
        <span>
          {row.original.tenant?.firstName} {row.original.tenant?.lastName}
        </span>
      ),
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.type.toLowerCase().replace('_', '-')}
        </span>
      ),
    },
    {
      id: 'dates',
      header: 'Term',
      cell: ({ row }) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {formatDate(row.original.startDate)} -{' '}
          {formatDate(row.original.endDate)}
        </div>
      ),
    },
    {
      accessorKey: 'monthlyRent',
      header: 'Monthly Rent',
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCurrency(row.original.monthlyRent)}
        </span>
      ),
    },
    {
      accessorKey: 'securityDeposit',
      header: 'Security Deposit',
      cell: ({ row }) => (
        <div>
          <span>{formatCurrency(row.original.securityDeposit)}</span>
          {row.original.securityDepositPaid && (
            <Badge variant="success" className="ml-2">
              Paid
            </Badge>
          )}
        </div>
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
        <div className="h-64 bg-muted rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leases</h1>
          <p className="mt-1 text-muted-foreground">Manage lease agreements</p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Create Lease
        </Button>
      </div>

      {/* Leases Table */}
      <DataTable columns={columns} data={leases} />
    </div>
  );
}
