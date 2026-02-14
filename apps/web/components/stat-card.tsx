import { Card, CardContent, cn } from '@repo/ui';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
  changeLabel?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  changeLabel,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn('shadow', className)}>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-4 flex items-center text-sm">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-success mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive mr-1" />
            )}
            <span className={isPositive ? 'text-success' : 'text-destructive'}>
              {isPositive ? '+' : ''}
              {change}%
            </span>
            {changeLabel && (
              <span className="ml-2 text-muted-foreground">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
