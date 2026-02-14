'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@repo/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const segmentLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  properties: 'Properties',
  tenants: 'Tenants',
  leases: 'Leases',
  payments: 'Payments',
  settings: 'Settings',
};

export function DashboardBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  const items = segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segmentLabels[segment] ?? segment;
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
