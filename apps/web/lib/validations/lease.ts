import { z } from 'zod';

export const leaseSchema = z
  .object({
    propertyId: z.string().min(1, 'Property is required'),
    tenantId: z.string().min(1, 'Tenant is required'),
    type: z.enum(['FIXED', 'MONTH_TO_MONTH']),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    monthlyRent: z.string().min(1, 'Monthly rent is required'),
    securityDeposit: z.string().min(1, 'Security deposit is required'),
    lateFeeAmount: z.string().optional(),
    lateFeeGracePeriodDays: z.string().optional(),
    paymentDueDay: z.string().optional(),
    terms: z.string().optional(),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

export type LeaseFormData = z.infer<typeof leaseSchema>;

// Cleaned data type for API submission
export type LeaseApiData = {
  propertyId: string;
  tenantId: string;
  type: 'FIXED' | 'MONTH_TO_MONTH';
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  lateFeeAmount?: number;
  lateFeeGracePeriodDays?: number;
  paymentDueDay?: number;
  terms?: string;
};

// Helper to clean form data for API submission
export function cleanLeaseData(data: LeaseFormData): LeaseApiData {
  const result: LeaseApiData = {
    propertyId: data.propertyId,
    tenantId: data.tenantId,
    type: data.type,
    startDate: data.startDate,
    endDate: data.endDate,
    monthlyRent: Number(data.monthlyRent) || 0,
    securityDeposit: Number(data.securityDeposit) || 0,
  };

  if (data.lateFeeAmount) {
    const num = Number(data.lateFeeAmount);
    if (!isNaN(num)) result.lateFeeAmount = num;
  }
  if (data.lateFeeGracePeriodDays) {
    const num = Number(data.lateFeeGracePeriodDays);
    if (!isNaN(num)) result.lateFeeGracePeriodDays = num;
  }
  if (data.paymentDueDay) {
    const num = Number(data.paymentDueDay);
    if (!isNaN(num)) result.paymentDueDay = num;
  }
  if (data.terms) result.terms = data.terms;

  return result;
}

export const LEASE_TYPE_OPTIONS = [
  { value: 'FIXED', label: 'Fixed Term' },
  { value: 'MONTH_TO_MONTH', label: 'Month-to-Month' },
] as const;
