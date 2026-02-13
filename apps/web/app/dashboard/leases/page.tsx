'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { leasesApi } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { Badge, getStatusVariant } from '@/components/ui/badge';
import { FileText, Plus, Calendar } from 'lucide-react';
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

  const columns = [
    {
      key: 'property',
      header: 'Property',
      render: (lease: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <p className="font-medium">{lease.property?.name}</p>
            <p className="text-sm text-muted-foreground">
              {lease.property?.city}, {lease.property?.state}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'tenant',
      header: 'Tenant',
      render: (lease: any) => (
        <span>
          {lease.tenant?.firstName} {lease.tenant?.lastName}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (lease: any) => (
        <span className="capitalize">
          {lease.type.toLowerCase().replace('_', '-')}
        </span>
      ),
    },
    {
      key: 'dates',
      header: 'Term',
      render: (lease: any) => (
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          {formatDate(lease.startDate)} - {formatDate(lease.endDate)}
        </div>
      ),
    },
    {
      key: 'monthlyRent',
      header: 'Monthly Rent',
      render: (lease: any) => (
        <span className="font-medium">{formatCurrency(lease.monthlyRent)}</span>
      ),
    },
    {
      key: 'securityDeposit',
      header: 'Security Deposit',
      render: (lease: any) => (
        <div>
          <span>{formatCurrency(lease.securityDeposit)}</span>
          {lease.securityDepositPaid && (
            <Badge variant="success" className="ml-2">
              Paid
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (lease: any) => (
        <Badge variant={getStatusVariant(lease.status)}>{lease.status}</Badge>
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
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          Create Lease
        </button>
      </div>

      {/* Leases Table */}
      <DataTable
        columns={columns}
        data={leases}
        keyExtractor={(lease) => lease.id}
        emptyMessage="No leases yet. Create a lease to connect a tenant with a property."
      />
    </div>
  );
}
