'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  AlertDescription,
  Button,
  Input,
  Label,
  Separator,
  Textarea,
} from '@repo/ui';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { tenantSchema, TenantFormData } from '@/lib/validations/tenant';

interface TenantFormProps {
  initialData?: Partial<TenantFormData>;
  onSubmit: (data: TenantFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function TenantForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
}: TenantFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TenantFormData>({
    resolver: zodResolver(tenantSchema),
    defaultValues: {
      firstName: initialData?.firstName ?? '',
      lastName: initialData?.lastName ?? '',
      email: initialData?.email ?? '',
      phone: initialData?.phone ?? '',
      dateOfBirth: initialData?.dateOfBirth ?? '',
      emergencyContact: {
        name: initialData?.emergencyContact?.name ?? '',
        relationship: initialData?.emergencyContact?.relationship ?? '',
        phone: initialData?.emergencyContact?.phone ?? '',
        email: initialData?.emergencyContact?.email ?? '',
      },
      employmentInfo: {
        employer: initialData?.employmentInfo?.employer ?? '',
        position: initialData?.employmentInfo?.position ?? '',
        monthlyIncome: initialData?.employmentInfo?.monthlyIncome ?? '',
        employerPhone: initialData?.employmentInfo?.employerPhone ?? '',
      },
      notes: initialData?.notes ?? '',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            placeholder="John"
            aria-invalid={!!errors.firstName}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            placeholder="Doe"
            aria-invalid={!!errors.lastName}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            placeholder="john.doe@example.com"
            aria-invalid={!!errors.email}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} />
        </div>
      </div>

      <Separator />

      {/* Emergency Contact */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Emergency Contact (Optional)</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="emergencyContact.name">Name</Label>
            <Input
              id="emergencyContact.name"
              {...register('emergencyContact.name')}
              placeholder="Jane Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact.relationship">Relationship</Label>
            <Input
              id="emergencyContact.relationship"
              {...register('emergencyContact.relationship')}
              placeholder="Spouse"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact.phone">Phone</Label>
            <Input
              id="emergencyContact.phone"
              type="tel"
              {...register('emergencyContact.phone')}
              placeholder="(555) 987-6543"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emergencyContact.email">Email</Label>
            <Input
              id="emergencyContact.email"
              type="email"
              {...register('emergencyContact.email')}
              placeholder="jane.doe@example.com"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Employment Info */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">
          Employment Information (Optional)
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="employmentInfo.employer">Employer</Label>
            <Input
              id="employmentInfo.employer"
              {...register('employmentInfo.employer')}
              placeholder="Acme Corp"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentInfo.position">Position</Label>
            <Input
              id="employmentInfo.position"
              {...register('employmentInfo.position')}
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentInfo.monthlyIncome">Monthly Income</Label>
            <Input
              id="employmentInfo.monthlyIncome"
              type="number"
              min="0"
              {...register('employmentInfo.monthlyIncome')}
              placeholder="5000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employmentInfo.employerPhone">Employer Phone</Label>
            <Input
              id="employmentInfo.employerPhone"
              type="tel"
              {...register('employmentInfo.employerPhone')}
              placeholder="(555) 111-2222"
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          {...register('notes')}
          placeholder="Any additional notes about the tenant..."
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
          {initialData ? 'Update Tenant' : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
}
