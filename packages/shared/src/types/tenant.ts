export type TenantStatus = 'active' | 'inactive' | 'pending' | 'evicted';

export interface Tenant {
  id: string;
  ownerId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  ssn?: string; // encrypted, last 4 digits for display
  status: TenantStatus;
  emergencyContact?: EmergencyContact;
  employmentInfo?: EmploymentInfo;
  currentLeaseId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface EmploymentInfo {
  employer: string;
  position?: string;
  monthlyIncome?: number;
  employerPhone?: string;
  employerAddress?: string;
}

export interface CreateTenantDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: Date;
  emergencyContact?: EmergencyContact;
  employmentInfo?: EmploymentInfo;
  notes?: string;
}

export interface UpdateTenantDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  status?: TenantStatus;
  emergencyContact?: EmergencyContact;
  employmentInfo?: EmploymentInfo;
  notes?: string;
}

export interface TenantFilters {
  ownerId?: string;
  status?: TenantStatus;
  search?: string; // search by name or email
  hasActiveLease?: boolean;
}
