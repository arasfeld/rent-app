'use client';

import { formatCurrency } from '@repo/core';
import { Badge, Button, DataTable } from '@repo/ui';
import { ColumnDef } from '@tanstack/react-table';
import { Building2, Mail, Pencil, Phone, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { DeleteConfirmModal } from '@/components/modals/delete-confirm-modal';
import { TenantModal } from '@/components/modals/tenant-modal';
import {
  useGetTenantsQuery,
  useCreateTenantMutation,
  useUpdateTenantMutation,
  useDeleteTenantMutation,
} from '@/lib/api';
import { getStatusVariant } from '@/lib/get-status-variant';
import { cleanTenantData, type TenantFormData } from '@/lib/validations/tenant';

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  dateOfBirth?: string;
  monthlyIncome?: number;
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
  };
  employmentInfo?: {
    employer?: string;
    position?: string;
    monthlyIncome?: number;
    employerPhone?: string;
  };
  notes?: string;
  leases?: Array<{
    status: string;
    monthlyRent: number;
    property?: {
      name: string;
    };
  }>;
}

export default function TenantsPage() {
  const { data, isLoading } = useGetTenantsQuery();
  const [createTenant] = useCreateTenantMutation();
  const [updateTenant] = useUpdateTenantMutation();
  const [deleteTenant] = useDeleteTenantMutation();

  const tenants = (data?.data ?? []) as Tenant[];

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [deletingTenant, setDeletingTenant] = useState<Tenant | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingTenant(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tenant: Tenant) => {
    setEditingTenant(tenant);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (tenant: Tenant) => {
    setDeletingTenant(tenant);
  };

  const handleSubmit = async (data: TenantFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const cleanedData = cleanTenantData(data);
      if (editingTenant) {
        await updateTenant({
          id: editingTenant.id,
          data: cleanedData as any,
        }).unwrap();
      } else {
        await createTenant(cleanedData as any).unwrap();
      }
      setIsModalOpen(false);
      setEditingTenant(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTenant) return;
    setIsDeleting(true);
    try {
      await deleteTenant(deletingTenant.id).unwrap();
      setDeletingTenant(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Tenant>[] = [
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
          (l) => l.status === 'ACTIVE'
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
          (l) => l.status === 'ACTIVE'
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
          <h1 className="text-2xl font-bold">Tenants</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your tenants and their information
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-5 w-5 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Tenants Table */}
      <DataTable columns={columns} data={tenants} />

      {/* Tenant Modal */}
      <TenantModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingTenant(null);
            setError(null);
          }
        }}
        tenant={editingTenant}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deletingTenant}
        onOpenChange={(open) => {
          if (!open) setDeletingTenant(null);
        }}
        title="Delete Tenant"
        description={`Are you sure you want to delete "${deletingTenant?.firstName} ${deletingTenant?.lastName}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
