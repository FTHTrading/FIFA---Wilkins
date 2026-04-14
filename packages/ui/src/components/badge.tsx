import * as React from 'react';
import { cn } from '../lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'emergency' | 'gold';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          default: 'bg-brand-electric/15 text-brand-electric',
          success: 'bg-brand-success/15 text-brand-success',
          warning: 'bg-brand-warning/15 text-brand-warning',
          danger: 'bg-brand-danger/15 text-brand-danger',
          info: 'bg-brand-muted/15 text-brand-muted',
          outline: 'border border-brand-border text-brand-muted bg-transparent',
          emergency: 'bg-brand-emergency text-white font-bold animate-pulse',
          gold: 'bg-brand-gold/15 text-brand-gold font-semibold',
        }[variant],
        className,
      )}
      {...props}
    />
  ),
);
Badge.displayName = 'Badge';

export { Badge };
