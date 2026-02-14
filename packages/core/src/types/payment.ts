export type PaymentStatus =
  | 'pending'
  | 'completed'
  | 'failed'
  | 'refunded'
  | 'cancelled';
export type PaymentType =
  | 'rent'
  | 'security_deposit'
  | 'late_fee'
  | 'maintenance'
  | 'utility'
  | 'other';
export type PaymentMethod =
  | 'cash'
  | 'check'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'venmo'
  | 'zelle'
  | 'other';

export interface Payment {
  id: string;
  leaseId: string;
  tenantId: string;
  propertyId: string;
  ownerId: string;
  type: PaymentType;
  status: PaymentStatus;
  amount: number;
  lateFee?: number;
  totalAmount: number;
  method?: PaymentMethod;
  dueDate: Date;
  paidDate?: Date;
  periodStart?: Date;
  periodEnd?: Date;
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentDto {
  leaseId: string;
  type: PaymentType;
  amount: number;
  lateFee?: number;
  method?: PaymentMethod;
  dueDate: Date;
  paidDate?: Date;
  periodStart?: Date;
  periodEnd?: Date;
  notes?: string;
}

export interface UpdatePaymentDto {
  status?: PaymentStatus;
  amount?: number;
  lateFee?: number;
  method?: PaymentMethod;
  dueDate?: Date;
  paidDate?: Date;
  transactionId?: string;
  notes?: string;
}

export interface RecordPaymentDto {
  leaseId: string;
  amount: number;
  method: PaymentMethod;
  paidDate?: Date;
  notes?: string;
}

export interface PaymentFilters {
  ownerId?: string;
  leaseId?: string;
  tenantId?: string;
  propertyId?: string;
  type?: PaymentType;
  status?: PaymentStatus;
  method?: PaymentMethod;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  paidDateFrom?: Date;
  paidDateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
}

export interface PaymentSummary {
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  paymentsThisMonth: number;
  overdueCount: number;
}

export interface PaymentWithDetails extends Payment {
  lease?: {
    id: string;
    monthlyRent: number;
  };
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  property?: {
    id: string;
    name: string;
    address: string;
  };
}
