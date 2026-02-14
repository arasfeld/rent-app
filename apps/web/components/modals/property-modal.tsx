'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from '@repo/ui';
import { PropertyForm } from '@/components/forms/property-form';
import { PropertyFormData } from '@/lib/validations/property';

interface PropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property?: {
    id: string;
    name: string;
    type: string;
    address?: {
      street?: string;
      unit?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    monthlyRent: number;
    securityDeposit?: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFeet?: number;
    yearBuilt?: number;
    description?: string;
  } | null;
  onSubmit: (data: PropertyFormData) => Promise<void>;
  isSubmitting?: boolean;
  error?: string | null;
}

export function PropertyModal({
  open,
  onOpenChange,
  property,
  onSubmit,
  isSubmitting = false,
  error,
}: PropertyModalProps) {
  const isEditing = !!property;

  // Normalize property data - API might return flat or nested address
  // Convert numbers to strings for form fields
  const initialData: Partial<PropertyFormData> | undefined = property
    ? {
        name: property.name,
        type: property.type as PropertyFormData['type'],
        address: {
          street: property.address?.street ?? property.street ?? '',
          unit: property.address?.unit ?? '',
          city: property.address?.city ?? property.city ?? '',
          state: property.address?.state ?? property.state ?? '',
          zipCode: property.address?.zipCode ?? property.zipCode ?? '',
          country: property.address?.country ?? '',
        },
        monthlyRent: String(property.monthlyRent ?? ''),
        securityDeposit:
          property.securityDeposit != null
            ? String(property.securityDeposit)
            : '',
        bedrooms: property.bedrooms != null ? String(property.bedrooms) : '',
        bathrooms: property.bathrooms != null ? String(property.bathrooms) : '',
        squareFeet:
          property.squareFeet != null ? String(property.squareFeet) : '',
        yearBuilt: property.yearBuilt != null ? String(property.yearBuilt) : '',
        description: property.description,
      }
    : undefined;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>
            {isEditing ? 'Edit Property' : 'Add Property'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the property details below.'
              : 'Fill in the details to add a new property.'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90vh-120px)]">
          <div className="px-6 pb-6">
            <PropertyForm
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
