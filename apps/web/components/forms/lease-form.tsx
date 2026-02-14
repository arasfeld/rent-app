'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  AlertDescription,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Textarea,
} from '@repo/ui';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import {
  leaseSchema,
  LeaseFormData,
  LEASE_TYPE_OPTIONS,
} from '@/lib/validations/lease';

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

interface LeaseFormProps {
  initialData?: Partial<LeaseFormData>;
  properties: Property[];
  tenants: Tenant[];
  onSubmit: (data: LeaseFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function LeaseForm({
  initialData,
  properties,
  tenants,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
}: LeaseFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LeaseFormData>({
    resolver: zodResolver(leaseSchema),
    defaultValues: {
      propertyId: initialData?.propertyId ?? '',
      tenantId: initialData?.tenantId ?? '',
      type: initialData?.type ?? 'FIXED',
      startDate: initialData?.startDate ?? '',
      endDate: initialData?.endDate ?? '',
      monthlyRent: initialData?.monthlyRent ?? '',
      securityDeposit: initialData?.securityDeposit ?? '',
      lateFeeAmount: initialData?.lateFeeAmount ?? '',
      lateFeeGracePeriodDays: initialData?.lateFeeGracePeriodDays ?? '',
      paymentDueDay: initialData?.paymentDueDay ?? '1',
      terms: initialData?.terms ?? '',
    },
  });

  const propertyId = watch('propertyId');
  const tenantId = watch('tenantId');
  const leaseType = watch('type');

  // When property is selected, prefill monthly rent
  const handlePropertyChange = (value: string) => {
    setValue('propertyId', value);
    const property = properties.find((p) => p.id === value);
    if (property) {
      setValue('monthlyRent', String(property.monthlyRent));
      setValue('securityDeposit', String(property.monthlyRent));
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

      {/* Property & Tenant Selection */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="propertyId">Property *</Label>
          <Select value={propertyId} onValueChange={handlePropertyChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select property" />
            </SelectTrigger>
            <SelectContent>
              {properties.map((property) => (
                <SelectItem key={property.id} value={property.id}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyId && (
            <p className="text-sm text-destructive">
              {errors.propertyId.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tenantId">Tenant *</Label>
          <Select
            value={tenantId}
            onValueChange={(value) => setValue('tenantId', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tenant" />
            </SelectTrigger>
            <SelectContent>
              {tenants.map((tenant) => (
                <SelectItem key={tenant.id} value={tenant.id}>
                  {tenant.firstName} {tenant.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tenantId && (
            <p className="text-sm text-destructive">
              {errors.tenantId.message}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Lease Details */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="type">Lease Type *</Label>
          <Select
            value={leaseType}
            onValueChange={(value) =>
              setValue('type', value as LeaseFormData['type'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {LEASE_TYPE_OPTIONS.map((option) => (
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
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            {...register('startDate')}
            aria-invalid={!!errors.startDate}
          />
          {errors.startDate && (
            <p className="text-sm text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate">End Date *</Label>
          <Input
            id="endDate"
            type="date"
            {...register('endDate')}
            aria-invalid={!!errors.endDate}
          />
          {errors.endDate && (
            <p className="text-sm text-destructive">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <Separator />

      {/* Financial Details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent *</Label>
          <Input
            id="monthlyRent"
            type="number"
            min="0"
            step="0.01"
            {...register('monthlyRent')}
            placeholder="1500"
            aria-invalid={!!errors.monthlyRent}
          />
          {errors.monthlyRent && (
            <p className="text-sm text-destructive">
              {errors.monthlyRent.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="securityDeposit">Security Deposit *</Label>
          <Input
            id="securityDeposit"
            type="number"
            min="0"
            step="0.01"
            {...register('securityDeposit')}
            placeholder="1500"
            aria-invalid={!!errors.securityDeposit}
          />
          {errors.securityDeposit && (
            <p className="text-sm text-destructive">
              {errors.securityDeposit.message}
            </p>
          )}
        </div>
      </div>

      <Separator />

      {/* Payment Settings */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Payment Settings (Optional)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="paymentDueDay">Payment Due Day</Label>
            <Select
              value={watch('paymentDueDay')}
              onValueChange={(value) => setValue('paymentDueDay', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                  <SelectItem key={day} value={String(day)}>
                    {day}
                    {day === 1
                      ? 'st'
                      : day === 2
                        ? 'nd'
                        : day === 3
                          ? 'rd'
                          : 'th'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateFeeAmount">Late Fee Amount</Label>
            <Input
              id="lateFeeAmount"
              type="number"
              min="0"
              step="0.01"
              {...register('lateFeeAmount')}
              placeholder="50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lateFeeGracePeriodDays">Grace Period (Days)</Label>
            <Input
              id="lateFeeGracePeriodDays"
              type="number"
              min="0"
              max="31"
              {...register('lateFeeGracePeriodDays')}
              placeholder="5"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Terms */}
      <div className="space-y-2">
        <Label htmlFor="terms">Lease Terms & Conditions</Label>
        <Textarea
          id="terms"
          {...register('terms')}
          placeholder="Enter any special terms or conditions..."
          rows={4}
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
          {initialData ? 'Update Lease' : 'Create Lease'}
        </Button>
      </div>
    </form>
  );
}
