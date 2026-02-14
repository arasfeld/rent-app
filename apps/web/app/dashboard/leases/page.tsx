'use client';

import { formatCurrency, formatDate } from '@repo/core';
import { Badge, Button, DataTable } from '@repo/ui';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, FileText, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { DeleteConfirmModal } from '@/components/modals/delete-confirm-modal';
import { LeaseModal } from '@/components/modals/lease-modal';
import {
  useGetLeasesQuery,
  useGetPropertiesQuery,
  useGetTenantsQuery,
  useCreateLeaseMutation,
  useUpdateLeaseMutation,
  useDeleteLeaseMutation,
} from '@/lib/api';
import { getStatusVariant } from '@/lib/get-status-variant';
import { cleanLeaseData, type LeaseFormData } from '@/lib/validations/lease';

interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  type: string;
  status: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  securityDepositPaid?: boolean;
  lateFeeAmount?: number;
  lateFeeGracePeriodDays?: number;
  paymentDueDay?: number;
  terms?: string;
  property?: {
    name: string;
    city?: string;
    state?: string;
  };
  tenant?: {
    firstName: string;
    lastName: string;
  };
}

interface Property {
  id: string;
  name: string;
  monthlyRent: number;
}

interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
}

export default function LeasesPage() {
  const { data: leasesData, isLoading: leasesLoading } = useGetLeasesQuery();
  const { data: propertiesData } = useGetPropertiesQuery();
  const { data: tenantsData } = useGetTenantsQuery();
  const [createLease] = useCreateLeaseMutation();
  const [updateLease] = useUpdateLeaseMutation();
  const [deleteLease] = useDeleteLeaseMutation();

  const leases = (leasesData?.data ?? []) as Lease[];
  const properties = (propertiesData?.data ?? []) as Property[];
  const tenants = (tenantsData?.data ?? []) as Tenant[];

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLease, setEditingLease] = useState<Lease | null>(null);
  const [deletingLease, setDeletingLease] = useState<Lease | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = () => {
    setEditingLease(null);
    setError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lease: Lease) => {
    setEditingLease(lease);
    setError(null);
    setIsModalOpen(true);
  };

  const handleDelete = (lease: Lease) => {
    setDeletingLease(lease);
  };

  const handleSubmit = async (data: LeaseFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const cleanedData = cleanLeaseData(data);
      if (editingLease) {
        await updateLease({
          id: editingLease.id,
          data: cleanedData as any,
        }).unwrap();
      } else {
        await createLease(cleanedData as any).unwrap();
      }
      setIsModalOpen(false);
      setEditingLease(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingLease) return;
    setIsDeleting(true);
    try {
      await deleteLease(deletingLease.id).unwrap();
      setDeletingLease(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const columns: ColumnDef<Lease>[] = [
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

  if (leasesLoading) {
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
        <Button onClick={handleCreate}>
          <Plus className="h-5 w-5 mr-2" />
          Create Lease
        </Button>
      </div>

      {/* Leases Table */}
      <DataTable columns={columns} data={leases} />

      {/* Lease Modal */}
      <LeaseModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingLease(null);
            setError(null);
          }
        }}
        lease={editingLease}
        properties={properties}
        tenants={tenants}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={!!deletingLease}
        onOpenChange={(open) => {
          if (!open) setDeletingLease(null);
        }}
        title="Delete Lease"
        description="Are you sure you want to delete this lease? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}
