'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  AlertDescription,
  Button,
  Input,
  Label,
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@repo/ui';
import {
  paymentSchema,
  PaymentFormData,
  PAYMENT_TYPE_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
} from '@/lib/validations/payment';
import { AlertCircle, Loader2 } from 'lucide-react';

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

interface PaymentFormProps {
  initialData?: Partial<PaymentFormData>;
  leases: Lease[];
  onSubmit: (data: PaymentFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function PaymentForm({
  initialData,
  leases,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
}: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      leaseId: initialData?.leaseId ?? '',
      type: initialData?.type ?? 'RENT',
      amount: initialData?.amount ?? '',
      lateFee: initialData?.lateFee ?? '',
      method: initialData?.method,
      dueDate: initialData?.dueDate ?? '',
      paidDate: initialData?.paidDate ?? '',
      periodStart: initialData?.periodStart ?? '',
      periodEnd: initialData?.periodEnd ?? '',
      notes: initialData?.notes ?? '',
    },
  });

  const leaseId = watch('leaseId');
  const paymentType = watch('type');
  const paymentMethod = watch('method');

  // When lease is selected, prefill amount with monthly rent
  const handleLeaseChange = (value: string) => {
    setValue('leaseId', value);
    const lease = leases.find((l) => l.id === value);
    if (lease && !initialData) {
      setValue('amount', String(lease.monthlyRent));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Lease Selection */}
      <div className="space-y-2">
        <Label htmlFor="leaseId">Lease *</Label>
        <Select value={leaseId} onValueChange={handleLeaseChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select lease" />
          </SelectTrigger>
          <SelectContent>
            {leases.map((lease) => (
              <SelectItem key={lease.id} value={lease.id}>
                {lease.property?.name} - {lease.tenant?.firstName}{' '}
                {lease.tenant?.lastName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.leaseId && (
          <p className="text-sm text-destructive">{errors.leaseId.message}</p>
        )}
      </div>

      <Separator />

      {/* Payment Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">Payment Type *</Label>
          <Select
            value={paymentType}
            onValueChange={(value) =>
              setValue('type', value as PaymentFormData['type'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && (
            <p className="text-sm text-destructive">{errors.type.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount *</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="0.01"
            {...register('amount')}
            placeholder="1500"
            aria-invalid={!!errors.amount}
          />
          {errors.amount && (
            <p className="text-sm text-destructive">{errors.amount.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="method">Payment Method</Label>
          <Select
            value={paymentMethod ?? ''}
            onValueChange={(value) =>
              setValue('method', value as PaymentFormData['method'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_METHOD_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="lateFee">Late Fee</Label>
          <Input
            id="lateFee"
            type="number"
            min="0"
            step="0.01"
            {...register('lateFee')}
            placeholder="50"
          />
        </div>
      </div>

      <Separator />

      {/* Dates */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date *</Label>
          <Input
            id="dueDate"
            type="date"
            {...register('dueDate')}
            aria-invalid={!!errors.dueDate}
          />
          {errors.dueDate && (
            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidDate">Paid Date</Label>
          <Input id="paidDate" type="date" {...register('paidDate')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodStart">Period Start</Label>
          <Input id="periodStart" type="date" {...register('periodStart')} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="periodEnd">Period End</Label>
          <Input id="periodEnd" type="date" {...register('periodEnd')} />
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Any additional notes about this payment..."
          rows={3}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update Payment' : 'Create Payment'}
        </Button>
      </div>
    </form>
  );
}
