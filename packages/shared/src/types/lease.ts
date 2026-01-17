export type LeaseStatus = 'draft' | 'active' | 'expired' | 'terminated' | 'renewed';
export type LeaseType = 'fixed' | 'month_to_month';

export interface Lease {
  id: string;
  propertyId: string;
  tenantId: string;
  ownerId: string;
  type: LeaseType;
  status: LeaseStatus;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  securityDepositPaid: boolean;
  lateFeeAmount?: number;
  lateFeeGracePeriodDays?: number;
  paymentDueDay: number; // 1-31, day of month rent is due
  terms?: string;
  documents: LeaseDocument[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaseDocument {
  id: string;
  name: string;
  url: string;
  type: 'lease_agreement' | 'addendum' | 'notice' | 'other';
  uploadedAt: Date;
}

export interface CreateLeaseDto {
  propertyId: string;
  tenantId: string;
  type: LeaseType;
  startDate: Date;
  endDate: Date;
  monthlyRent: number;
  securityDeposit: number;
  lateFeeAmount?: number;
  lateFeeGracePeriodDays?: number;
  paymentDueDay?: number;
  terms?: string;
}

export interface UpdateLeaseDto {
  type?: LeaseType;
  status?: LeaseStatus;
  startDate?: Date;
  endDate?: Date;
  monthlyRent?: number;
  securityDeposit?: number;
  securityDepositPaid?: boolean;
  lateFeeAmount?: number;
  lateFeeGracePeriodDays?: number;
  paymentDueDay?: number;
  terms?: string;
}

export interface LeaseFilters {
  ownerId?: string;
  propertyId?: string;
  tenantId?: string;
  status?: LeaseStatus;
  type?: LeaseType;
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
}

export interface LeaseWithDetails extends Lease {
  property?: {
    id: string;
    name: string;
    address: string;
  };
  tenant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}
