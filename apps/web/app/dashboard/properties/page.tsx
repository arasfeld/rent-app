'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { propertiesApi } from '@/lib/api';
import { DataTable } from '@/components/ui/data-table';
import { Badge, getStatusVariant } from '@/components/ui/badge';
import { Building2, Plus, MapPin } from 'lucide-react';
import { formatCurrency } from '@repo/shared/utils';

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

  const columns = [
    {
      key: 'name',
      header: 'Property',
      render: (property: any) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div className="ml-4">
            <p className="font-medium">{property.name}</p>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              {property.city}, {property.state}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (property: any) => (
        <span className="capitalize">
          {property.type.toLowerCase().replace('_', ' ')}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (property: any) => (
        <Badge variant={getStatusVariant(property.status)}>
          {property.status}
        </Badge>
      ),
    },
    {
      key: 'details',
      header: 'Details',
      render: (property: any) => (
        <span className="text-muted-foreground">
          {property.bedrooms} bed · {property.bathrooms} bath
        </span>
      ),
    },
    {
      key: 'monthlyRent',
      header: 'Monthly Rent',
      render: (property: any) => (
        <span className="font-medium">
          {formatCurrency(property.monthlyRent)}
        </span>
      ),
    },
    {
      key: 'tenant',
      header: 'Current Tenant',
      render: (property: any) => {
        const activeLease = property.leases?.find(
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
        <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90">
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      {/* Properties Table */}
      <DataTable
        columns={columns}
        data={properties}
        keyExtractor={(property) => property.id}
        emptyMessage="No properties yet. Add your first property to get started."
      />
    </div>
  );
}
