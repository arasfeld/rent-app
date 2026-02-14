import { z } from 'zod';

const addressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  unit: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: z.string().optional(),
});

export const propertySchema = z.object({
  name: z.string().min(1, 'Property name is required'),
  type: z.enum([
    'SINGLE_FAMILY',
    'MULTI_FAMILY',
    'APARTMENT',
    'CONDO',
    'TOWNHOUSE',
    'COMMERCIAL',
  ]),
  address: addressSchema,
  units: z.string().optional(),
  bedrooms: z.string().optional(),
  bathrooms: z.string().optional(),
  squareFeet: z.string().optional(),
  yearBuilt: z.string().optional(),
  description: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  monthlyRent: z.string().min(1, 'Monthly rent is required'),
  securityDeposit: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// Cleaned data type for API submission
export type PropertyApiData = {
  name: string;
  type: PropertyFormData['type'];
  address: PropertyFormData['address'];
  units?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  yearBuilt?: number;
  description?: string;
  amenities?: string[];
  monthlyRent: number;
  securityDeposit?: number;
};

// Helper to convert string to number or undefined
function toNumber(val: string | undefined): number | undefined {
  if (!val || val === '') return undefined;
  const num = Number(val);
  return isNaN(num) ? undefined : num;
}

// Helper to clean form data for API submission
export function cleanPropertyData(data: PropertyFormData): PropertyApiData {
  return {
    name: data.name,
    type: data.type,
    address: data.address,
    units: toNumber(data.units),
    bedrooms: toNumber(data.bedrooms),
    bathrooms: toNumber(data.bathrooms),
    squareFeet: toNumber(data.squareFeet),
    yearBuilt: toNumber(data.yearBuilt),
    description: data.description || undefined,
    amenities: data.amenities,
    monthlyRent: Number(data.monthlyRent) || 0,
    securityDeposit: toNumber(data.securityDeposit),
  };
}

export const PROPERTY_TYPE_OPTIONS = [
  { value: 'SINGLE_FAMILY', label: 'Single Family Home' },
  { value: 'MULTI_FAMILY', label: 'Multi-Family Home' },
  { value: 'APARTMENT', label: 'Apartment' },
  { value: 'CONDO', label: 'Condominium' },
  { value: 'TOWNHOUSE', label: 'Townhouse' },
  { value: 'COMMERCIAL', label: 'Commercial' },
] as const;
