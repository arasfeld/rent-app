'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { propertiesApi } from '@/lib/api';
import { DataTable } from '@repo/ui/components/data-table';
import { Badge } from '@repo/ui/components/badge';
import { Button } from '@repo/ui/components/button';
import { getStatusVariant } from '@/lib/get-status-variant';
import { Building2, Plus, MapPin } from 'lucide-react';
import { formatCurrency } from '@repo/shared/utils';
import { ColumnDef } from '@tanstack/react-table';

export default function PropertiesPage() {
  const { token } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      propertiesApi
        .getAll(token)
        .then((response) => setProperties(response.data))
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [token]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Property',
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <p className="font-medium">{row.original.name}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {row.original.city}, {row.original.state}
            </div>
          </div>
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
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'details',
      header: 'Details',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.bedrooms} bed · {row.original.bathrooms} bath
        </span>
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
      id: 'tenant',
      header: 'Current Tenant',
      cell: ({ row }) => {
        const activeLease = row.original.leases?.find(
          (l: any) => l.status === 'ACTIVE'
        );
        if (activeLease?.tenant) {
          return (
            <span>
              {activeLease.tenant.firstName} {activeLease.tenant.lastName}
            </span>
          );
        }
        return <span className="text-muted-foreground">Vacant</span>;
      },
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
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your rental properties
          </p>
        </div>
        <Button>
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Properties Table */}
      <DataTable columns={columns} data={properties} />
    </div>
  );
}
