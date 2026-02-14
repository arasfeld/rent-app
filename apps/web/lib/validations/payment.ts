import { z } from 'zod';

export const paymentSchema = z.object({
  leaseId: z.string().min(1, 'Lease is required'),
  type: z.enum([
    'RENT',
    'SECURITY_DEPOSIT',
    'LATE_FEE',
    'MAINTENANCE',
    'UTILITY',
    'OTHER',
  ]),
  amount: z.string().min(1, 'Amount is required'),
  lateFee: z.string().optional(),
  method: z
    .enum([
      'CASH',
      'CHECK',
      'BANK_TRANSFER',
      'CREDIT_CARD',
      'DEBIT_CARD',
      'VENMO',
      'ZELLE',
      'OTHER',
    ])
    .optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  paidDate: z.string().optional(),
  periodStart: z.string().optional(),
  periodEnd: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// Cleaned data type for API submission
export type PaymentApiData = {
  leaseId: string;
  type:
    | 'RENT'
    | 'SECURITY_DEPOSIT'
    | 'LATE_FEE'
    | 'MAINTENANCE'
    | 'UTILITY'
    | 'OTHER';
  amount: number;
  lateFee?: number;
  method?:
    | 'CASH'
    | 'CHECK'
    | 'BANK_TRANSFER'
    | 'CREDIT_CARD'
    | 'DEBIT_CARD'
    | 'VENMO'
    | 'ZELLE'
    | 'OTHER';
  dueDate: string;
  paidDate?: string;
  periodStart?: string;
  periodEnd?: string;
  notes?: string;
};

// Helper to clean form data for API submission
export function cleanPaymentData(data: PaymentFormData): PaymentApiData {
  const result: PaymentApiData = {
    leaseId: data.leaseId,
    type: data.type,
    amount: Number(data.amount) || 0,
    dueDate: data.dueDate,
  };

  if (data.lateFee) {
    const num = Number(data.lateFee);
    if (!isNaN(num)) result.lateFee = num;
  }
  if (data.method) result.method = data.method;
  if (data.paidDate) result.paidDate = data.paidDate;
  if (data.periodStart) result.periodStart = data.periodStart;
  if (data.periodEnd) result.periodEnd = data.periodEnd;
  if (data.notes) result.notes = data.notes;

  return result;
}

export const PAYMENT_TYPE_OPTIONS = [
  { value: 'RENT', label: 'Rent Payment' },
  { value: 'SECURITY_DEPOSIT', label: 'Security Deposit' },
  { value: 'LATE_FEE', label: 'Late Fee' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'UTILITY', label: 'Utility' },
  { value: 'OTHER', label: 'Other' },
] as const;

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CHECK', label: 'Check' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'CREDIT_CARD', label: 'Credit Card' },
  { value: 'DEBIT_CARD', label: 'Debit Card' },
  { value: 'VENMO', label: 'Venmo' },
  { value: 'ZELLE', label: 'Zelle' },
  { value: 'OTHER', label: 'Other' },
] as const;
