import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow',
        outline: 'text-foreground',
        success:
          'border-transparent bg-[color:var(--success)] text-[color:var(--success-foreground)] shadow',
        warning:
          'border-transparent bg-[color:var(--warning)] text-[color:var(--warning-foreground)] shadow',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

type StatusVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning';

function getStatusVariant(status: string): StatusVariant {
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

  return statusMap[status.toLowerCase()] || 'secondary';
}

export { Badge, badgeVariants, getStatusVariant };
