'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { tenantsApi } from '@/lib/api';
import { DataTable } from '@repo/ui/components/data-table';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { getStatusVariant } from '@/lib/get-status-variant';
import { Plus, Mail, Phone, Building2 } from 'lucide-react';
import { formatCurrency } from '@repo/shared/utils';
import { ColumnDef } from '@tanstack/react-table';

export default function TenantsPage() {
  const { token } = useAuth();
  const [tenants, setTenants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      tenantsApi
        .getAll(token)
        .then((response) => setTenants(response.data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const columns: ColumnDef<any>[] = [
    {
      id: 'name',
      header: 'Tenant',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">
              {row.original.firstName?.[0]}
              {row.original.lastName?.[0]}
            </span>
          </div>
          <div className="ml-4">
            <p className="font-medium">
              {row.original.firstName} {row.original.lastName}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {row.original.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      cell: ({ row }) => (
        <div className="flex items-center text-muted-foreground">
          <Phone className="h-4 w-4 mr-2" />
          {row.original.phone || '-'}
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
    {
      id: 'property',
      header: 'Property',
      cell: ({ row }) => {
        const activeLease = row.original.leases?.find(
          (l: any) => l.status === 'ACTIVE'
        );
        if (activeLease?.property) {
          return (
            <div className="flex items-center">
              <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
              {activeLease.property.name}
            </div>
          );
        }
        return <span className="text-muted-foreground">No active lease</span>;
      },
    },
    {
      id: 'monthlyRent',
      header: 'Monthly Rent',
      cell: ({ row }) => {
        const activeLease = row.original.leases?.find(
          (l: any) => l.status === 'ACTIVE'
        );
        if (activeLease) {
          return (
            <span className="font-medium">
              {formatCurrency(activeLease.monthlyRent)}
            </span>
          );
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      accessorKey: 'monthlyIncome',
      header: 'Monthly Income',
      cell: ({ row }) => (
        <span>
          {row.original.monthlyIncome
            ? formatCurrency(row.original.monthlyIncome)
            : '-'}
        </span>
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
          <h1 className="text-2xl font-bold">Tenants</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your tenants and their information
          </p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Tenants Table */}
      <DataTable columns={columns} data={tenants} />
    </div>
  );
}
