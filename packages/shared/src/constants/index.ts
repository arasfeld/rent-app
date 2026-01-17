// Property constants
export const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'multi_family', label: 'Multi-Family Home' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condominium' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial' },
] as const;

export const PROPERTY_STATUSES = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'occupied', label: 'Occupied', color: 'blue' },
  { value: 'maintenance', label: 'Under Maintenance', color: 'yellow' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
] as const;

// Tenant constants
export const TENANT_STATUSES = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'evicted', label: 'Evicted', color: 'red' },
] as const;

// Lease constants
export const LEASE_TYPES = [
  { value: 'fixed', label: 'Fixed Term' },
  { value: 'month_to_month', label: 'Month-to-Month' },
] as const;

export const LEASE_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'expired', label: 'Expired', color: 'red' },
  { value: 'terminated', label: 'Terminated', color: 'red' },
  { value: 'renewed', label: 'Renewed', color: 'blue' },
] as const;

// Payment constants
export const PAYMENT_TYPES = [
  { value: 'rent', label: 'Rent Payment' },
  { value: 'security_deposit', label: 'Security Deposit' },
  { value: 'late_fee', label: 'Late Fee' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'utility', label: 'Utility' },
  { value: 'other', label: 'Other' },
] as const;

export const PAYMENT_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'failed', label: 'Failed', color: 'red' },
  { value: 'refunded', label: 'Refunded', color: 'purple' },
  { value: 'cancelled', label: 'Cancelled', color: 'gray' },
] as const;

export const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'debit_card', label: 'Debit Card' },
  { value: 'venmo', label: 'Venmo' },
  { value: 'zelle', label: 'Zelle' },
  { value: 'other', label: 'Other' },
] as const;

// Reminder constants
export const REMINDER_TYPES = [
  { value: 'lease_expiration', label: 'Lease Expiration' },
  { value: 'rent_due', label: 'Rent Due' },
  { value: 'payment_overdue', label: 'Payment Overdue' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'inspection', label: 'Inspection' },
  { value: 'insurance_renewal', label: 'Insurance Renewal' },
  { value: 'custom', label: 'Custom' },
] as const;

// US States for address forms
export const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
] as const;

// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  PROPERTIES: {
    BASE: '/properties',
    BY_ID: (id: string) => `/properties/${id}`,
  },
  TENANTS: {
    BASE: '/tenants',
    BY_ID: (id: string) => `/tenants/${id}`,
  },
  LEASES: {
    BASE: '/leases',
    BY_ID: (id: string) => `/leases/${id}`,
  },
  PAYMENTS: {
    BASE: '/payments',
    BY_ID: (id: string) => `/payments/${id}`,
    RECORD: '/payments/record',
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
  },
} as const;

// Default pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM d, yyyy',
  INPUT: 'yyyy-MM-dd',
  FULL: 'MMMM d, yyyy',
  WITH_TIME: 'MMM d, yyyy h:mm a',
} as const;

// Grace period defaults
export const DEFAULT_LATE_FEE_GRACE_PERIOD_DAYS = 5;
export const DEFAULT_PAYMENT_DUE_DAY = 1;
