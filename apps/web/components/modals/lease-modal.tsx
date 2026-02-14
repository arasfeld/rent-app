'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { ScrollArea } from '@repo/ui/components/scroll-area';
import { LeaseForm } from '@/components/forms/lease-form';
import { LeaseFormData } from '@/lib/validations/lease';

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

interface LeaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lease?: {
    id: string;
    propertyId: string;
    tenantId: string;
    type: string;
    startDate: string;
    endDate: string;
    monthlyRent: number;
    securityDeposit: number;
    lateFeeAmount?: number;
    lateFeeGracePeriodDays?: number;
    paymentDueDay?: number;
    terms?: string;
  } | null;
  properties: Property[];
  tenants: Tenant[];
  onSubmit: (data: LeaseFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

export function LeaseModal({
  open,
  onOpenChange,
  lease,
  properties,
  tenants,
  onSubmit,
  isSubmitting = false,
  error,
}: LeaseModalProps) {
  const isEditing = !!lease;

  // Format date for input (YYYY-MM-DD)
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0] ?? '';
    } catch {
      return '';
    }
  };

  const initialData: Partial<LeaseFormData> | undefined = lease
    ? {
        propertyId: lease.propertyId,
        tenantId: lease.tenantId,
        type: lease.type as LeaseFormData['type'],
        startDate: formatDate(lease.startDate),
        endDate: formatDate(lease.endDate),
        monthlyRent: String(lease.monthlyRent),
        securityDeposit: String(lease.securityDeposit),
        lateFeeAmount:
          lease.lateFeeAmount != null ? String(lease.lateFeeAmount) : '',
        lateFeeGracePeriodDays:
          lease.lateFeeGracePeriodDays != null
            ? String(lease.lateFeeGracePeriodDays)
            : '',
        paymentDueDay:
          lease.paymentDueDay != null ? String(lease.paymentDueDay) : '1',
        terms: lease.terms ?? '',
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{isEditing ? 'Edit Lease' : 'Create Lease'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the lease details below.'
              : 'Fill in the details to create a new lease agreement.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6">
            <LeaseForm
              initialData={initialData}
              properties={properties}
              tenants={tenants}
              onSubmit={onSubmit}
              onCancel={() => onOpenChange(false)}
              isSubmitting={isSubmitting}
              error={error}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
