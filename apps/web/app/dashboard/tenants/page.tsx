'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { tenantsApi } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { Badge, getStatusVariant } from '@/components/ui/badge';
import { Plus, Mail, Phone, Building2 } from 'lucide-react';
import { formatCurrency } from '@repo/shared/utils';

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

  const columns = [
    {
      key: 'name',
      header: 'Tenant',
      render: (tenant: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">
              {tenant.firstName?.[0]}{tenant.lastName?.[0]}
            </span>
          </div>
          <div className="ml-4">
            <p className="font-medium">
              {tenant.firstName} {tenant.lastName}
            </p>
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {tenant.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Phone',
      render: (tenant: any) => (
        <div className="flex items-center text-muted-foreground">
          <Phone className="h-4 w-4 mr-2" />
          {tenant.phone || '-'}
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (tenant: any) => (
        <Badge variant={getStatusVariant(tenant.status)}>
          {tenant.status}
        </Badge>
      ),
    },
    {
      key: 'property',
      header: 'Property',
      render: (tenant: any) => {
        const activeLease = tenant.leases?.find((l: any) => l.status === 'ACTIVE');
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
      key: 'monthlyRent',
      header: 'Monthly Rent',
      render: (tenant: any) => {
        const activeLease = tenant.leases?.find((l: any) => l.status === 'ACTIVE');
        if (activeLease) {
          return <span className="font-medium">{formatCurrency(activeLease.monthlyRent)}</span>;
        }
        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      key: 'income',
      header: 'Monthly Income',
      render: (tenant: any) => (
        <span>{tenant.monthlyIncome ? formatCurrency(tenant.monthlyIncome) : '-'}</span>
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
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Tenant
        </button>
      </div>

      {/* Tenants Table */}
      <DataTable
        columns={columns}
        data={tenants}
        keyExtractor={(tenant) => tenant.id}
        emptyMessage="No tenants yet. Add your first tenant to get started."
      />
    </div>
  );
}
