import * as React from 'react';

import { cn } from '@/lib/utils';

type StatusBadgeVariant = 'approved' | 'rejected' | 'pending';

const statusBadgeStyles: Record<StatusBadgeVariant, string> = {
  approved: 'border-[#22C55E] text-[#22C55E]',
  rejected: 'border-[#EF4444] text-[#EF4444]',
  pending: 'border-[#3B82F6] text-[#3B82F6]',
};

interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: StatusBadgeVariant;
}

function StatusBadge({ className, variant, children, ...props }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full border bg-transparent px-3 py-1 font-medium text-xs transition-colors',
        statusBadgeStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { StatusBadge, type StatusBadgeVariant };
