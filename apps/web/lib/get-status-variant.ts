type StatusVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

const statusMap: Record<string, StatusVariant> = {
  // Property status
  available: 'success',
  occupied: 'default',
  maintenance: 'warning',
  inactive: 'secondary',

  // Tenant status
  active: 'success',
  pending: 'warning',
  evicted: 'destructive',

  // Lease status
  draft: 'secondary',
  expired: 'destructive',
  terminated: 'destructive',
  renewed: 'default',

  // Payment status
  completed: 'success',
  failed: 'destructive',
  refunded: 'warning',
  cancelled: 'secondary',
};

export function getStatusVariant(status: string): StatusVariant {
  return statusMap[status.toLowerCase()] || 'secondary';
}
