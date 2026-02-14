export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DashboardStats {
  totalProperties: number;
  totalTenants: number;
  activeLeases: number;
  monthlyRevenue: number;
  occupancyRate: number;
  overduePayments: number;
  upcomingLeaseExpirations: number;
}

export interface Reminder {
  id: string;
  ownerId: string;
  type: ReminderType;
  title: string;
  description?: string;
  dueDate: Date;
  relatedEntityId?: string;
  relatedEntityType?: 'property' | 'tenant' | 'lease' | 'payment';
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ReminderType =
  | 'lease_expiration'
  | 'rent_due'
  | 'payment_overdue'
  | 'maintenance'
  | 'inspection'
  | 'insurance_renewal'
  | 'custom';

export interface CreateReminderDto {
  type: ReminderType;
  title: string;
  description?: string;
  dueDate: Date;
  relatedEntityId?: string;
  relatedEntityType?: 'property' | 'tenant' | 'lease' | 'payment';
}
