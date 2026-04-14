import * as React from 'react';
import { cn } from '../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  hint?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, hint, startIcon, endIcon, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-brand-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {startIcon && (
            <span className="pointer-events-none absolute left-3 text-brand-muted">
              {startIcon}
            </span>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-brand-slate px-3 py-2 text-sm text-brand-text placeholder:text-brand-muted',
              'border-brand-border focus:border-brand-electric focus:outline-none focus:ring-1 focus:ring-brand-electric',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-colors',
              startIcon && 'pl-9',
              endIcon && 'pr-9',
              error && 'border-brand-danger focus:border-brand-danger focus:ring-brand-danger',
              className,
            )}
            ref={ref}
            {...props}
          />
          {endIcon && (
            <span className="absolute right-3 text-brand-muted">{endIcon}</span>
          )}
        </div>
        {hint && !error && <p className="text-xs text-brand-muted">{hint}</p>}
        {error && <p className="text-xs text-brand-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
