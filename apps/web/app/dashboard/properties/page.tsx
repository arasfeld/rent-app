'use client';

import { formatCurrency } from '@repo/shared';
import { Badge, Button, DataTable } from '@repo/ui';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, MapPin, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { DeleteConfirmModal } from '@/components/modals/delete-confirm-modal';
import { PropertyModal } from '@/components/modals/property-modal';
import {
  useGetPropertiesQuery,
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
} from '@/lib/api';
import { getStatusVariant } from '@/lib/get-status-variant';
import {
  cleanPropertyData,
  type PropertyFormData,
} from '@/lib/validations/property';

interface Property {
  id: string;
  name: string;
  type: string;
  status: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  address?: {
    street?: string;
    unit?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  monthlyRent: number;
  securityDeposit?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  description?: string;
  leases?: Array<{
    status: string;
    tenant?: {
      firstName: string;
      lastName: string;
    };
  }>;
}

export default function PropertiesPage() {
  const { data, isLoading } = useGetPropertiesQuery();
  const [createProperty] = useCreatePropertyMutation();
  const [updateProperty] = useUpdatePropertyMutation();
  const [deleteProperty] = useDeletePropertyMutation();

  const properties = (data?.data ?? []) as Property[];

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [deletingProperty, setDeletingProperty] = useState<Property | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingProperty(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (property: Property) => {
    setDeletingProperty(property);
  };

  const handleSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const cleanedData = cleanPropertyData(data);
      if (editingProperty) {
        await updateProperty({
          id: editingProperty.id,
          data: cleanedData as any,
        }).unwrap();
      } else {
        await createProperty(cleanedData as any).unwrap();
      }
      setIsModalOpen(false);
      setEditingProperty(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProperty) return;
    setIsDeleting(true);
    try {
      await deleteProperty(deletingProperty.id).unwrap();
      setDeletingProperty(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Property>[] = [
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
              {row.original.address?.city ?? row.original.city},{' '}
              {row.original.address?.state ?? row.original.state}
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
          {row.original.bedrooms ?? '\u2013'} bed ·{' '}
          {row.original.bathrooms ?? '\u2013'} bath
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
          (l) => l.status === 'ACTIVE'
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
        <Button onClick={handleCreate}>
          <Plus className="h-5 w-5 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Properties Table */}
      <DataTable columns={columns} data={properties} />

      {/* Property Modal */}
      <PropertyModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingProperty(null);
            setError(null);
          }
        }}
        property={editingProperty}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deletingProperty}
        onOpenChange={(open) => {
          if (!open) setDeletingProperty(null);
        }}
        title="Delete Property"
        description={`Are you sure you want to delete "${deletingProperty?.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
