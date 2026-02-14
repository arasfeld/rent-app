'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { US_STATES } from '@repo/shared';
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
  propertySchema,
  PropertyFormData,
  PROPERTY_TYPE_OPTIONS,
} from '@/lib/validations/property';

interface PropertyFormProps {
  initialData?: Partial<PropertyFormData>;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  error?: string | null;
}

export function PropertyForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
  error,
}: PropertyFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: initialData?.name ?? '',
      type: initialData?.type ?? 'SINGLE_FAMILY',
      address: {
        street: initialData?.address?.street ?? '',
        unit: initialData?.address?.unit ?? '',
        city: initialData?.address?.city ?? '',
        state: initialData?.address?.state ?? '',
        zipCode: initialData?.address?.zipCode ?? '',
        country: initialData?.address?.country ?? '',
      },
      monthlyRent: initialData?.monthlyRent ?? '',
      securityDeposit: initialData?.securityDeposit ?? '',
      bedrooms: initialData?.bedrooms ?? '',
      bathrooms: initialData?.bathrooms ?? '',
      squareFeet: initialData?.squareFeet ?? '',
      yearBuilt: initialData?.yearBuilt ?? '',
      description: initialData?.description ?? '',
    },
  });

  const propertyType = watch('type');
  const addressState = watch('address.state');

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
          <Label htmlFor="name">Property Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Sunset Apartments"
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Property Type *</Label>
          <Select
            value={propertyType}
            onValueChange={(value) =>
              setValue('type', value as PropertyFormData['type'])
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPE_OPTIONS.map((option) => (
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
      </div>

      <Separator />

      {/* Address */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Address</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="street">Street Address *</Label>
            <Input
              id="street"
              {...register('address.street')}
              placeholder="123 Main St"
              aria-invalid={!!errors.address?.street}
            />
            {errors.address?.street && (
              <p className="text-sm text-destructive">
                {errors.address.street.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit / Apt</Label>
            <Input
              id="unit"
              {...register('address.unit')}
              placeholder="Apt 4B"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...register('address.city')}
              placeholder="San Francisco"
              aria-invalid={!!errors.address?.city}
            />
            {errors.address?.city && (
              <p className="text-sm text-destructive">
                {errors.address.city.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              value={addressState}
              onValueChange={(value) => setValue('address.state', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.address?.state && (
              <p className="text-sm text-destructive">
                {errors.address.state.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              {...register('address.zipCode')}
              placeholder="94102"
              aria-invalid={!!errors.address?.zipCode}
            />
            {errors.address?.zipCode && (
              <p className="text-sm text-destructive">
                {errors.address.zipCode.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Rent */}
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
          <Label htmlFor="securityDeposit">Security Deposit</Label>
          <Input
            id="securityDeposit"
            type="number"
            min="0"
            step="0.01"
            {...register('securityDeposit')}
            placeholder="1500"
          />
        </div>
      </div>

      <Separator />

      {/* Property Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Property Details (Optional)</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              min="0"
              {...register('bedrooms')}
              placeholder="2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              min="0"
              step="0.5"
              {...register('bathrooms')}
              placeholder="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="squareFeet">Square Feet</Label>
            <Input
              id="squareFeet"
              type="number"
              min="0"
              {...register('squareFeet')}
              placeholder="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearBuilt">Year Built</Label>
            <Input
              id="yearBuilt"
              type="number"
              min="1800"
              max="2100"
              {...register('yearBuilt')}
              placeholder="1990"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Describe the property..."
            rows={3}
          />
        </div>
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
          {initialData ? 'Update Property' : 'Create Property'}
        </Button>
      </div>
    </form>
  );
}
