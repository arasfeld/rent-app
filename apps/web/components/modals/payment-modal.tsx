'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from '@repo/ui';
import { PaymentForm } from '@/components/forms/payment-form';
import { PaymentFormData } from '@/lib/validations/payment';

interface Lease {
  id: string;
  monthlyRent: number;
  property?: {
    name: string;
  };
  tenant?: {
    firstName: string;
    lastName: string;
  };
}

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: {
    id: string;
    leaseId: string;
    type: string;
    amount: number;
    lateFee?: number;
    method?: string;
    dueDate: string;
    paidDate?: string;
    periodStart?: string;
    periodEnd?: string;
    notes?: string;
  } | null;
  leases: Lease[];
  onSubmit: (data: PaymentFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

export function PaymentModal({
  open,
  onOpenChange,
  payment,
  leases,
  onSubmit,
  isSubmitting = false,
  error,
}: PaymentModalProps) {
  const isEditing = !!payment;

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

  const initialData: Partial<PaymentFormData> | undefined = payment
    ? {
        leaseId: payment.leaseId,
        type: payment.type as PaymentFormData['type'],
        amount: String(payment.amount),
        lateFee: payment.lateFee != null ? String(payment.lateFee) : '',
        method: payment.method as PaymentFormData['method'],
        dueDate: formatDate(payment.dueDate),
        paidDate: formatDate(payment.paidDate),
        periodStart: formatDate(payment.periodStart),
        periodEnd: formatDate(payment.periodEnd),
        notes: payment.notes ?? '',
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEditing ? 'Edit Payment' : 'Record Payment'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the payment details below.'
              : 'Fill in the details to record a new payment.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6">
            <PaymentForm
              initialData={initialData}
              leases={leases}
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
