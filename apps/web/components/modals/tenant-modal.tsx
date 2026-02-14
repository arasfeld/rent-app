'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from '@repo/ui';

import { TenantForm } from '@/components/forms/tenant-form';
import { TenantFormData } from '@/lib/validations/tenant';

interface TenantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
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
  } | null;
  onSubmit: (data: TenantFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

export function TenantModal({
  open,
  onOpenChange,
  tenant,
  onSubmit,
  isSubmitting = false,
  error,
}: TenantModalProps) {
  const isEditing = !!tenant;

  const initialData: Partial<TenantFormData> | undefined = tenant
    ? {
        firstName: tenant.firstName,
        lastName: tenant.lastName,
        email: tenant.email,
        phone: tenant.phone ?? '',
        dateOfBirth: tenant.dateOfBirth ?? '',
        emergencyContact: tenant.emergencyContact
          ? {
              name: tenant.emergencyContact.name ?? '',
              relationship: tenant.emergencyContact.relationship ?? '',
              phone: tenant.emergencyContact.phone ?? '',
              email: tenant.emergencyContact.email ?? '',
            }
          : undefined,
        employmentInfo: tenant.employmentInfo
          ? {
              employer: tenant.employmentInfo.employer ?? '',
              position: tenant.employmentInfo.position ?? '',
              monthlyIncome:
                tenant.employmentInfo.monthlyIncome != null
                  ? String(tenant.employmentInfo.monthlyIncome)
                  : '',
              employerPhone: tenant.employmentInfo.employerPhone ?? '',
            }
          : undefined,
        notes: tenant.notes ?? '',
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>{isEditing ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the tenant details below.'
              : 'Fill in the details to add a new tenant.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6">
            <TenantForm
              initialData={initialData}
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
