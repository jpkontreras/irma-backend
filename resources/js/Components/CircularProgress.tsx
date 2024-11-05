import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

const circularProgressVariants = cva(
  'relative inline-flex items-center justify-center rounded-full',
  {
    variants: {
      size: {
        sm: 'h-12 w-12',
        default: 'h-20 w-20',
        lg: 'h-24 w-24',
      },
      variant: {
        default: 'text-primary',
        success: 'text-green-500',
        warning: 'text-yellow-500',
        danger: 'text-red-500',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  },
);

interface CircularProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof circularProgressVariants> {
  value: number;
  showValue?: boolean;
  thickness?: number;
}

const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      className,
      size,
      variant,
      value,
      showValue = true,
      thickness = 4,
      ...props
    },
    ref,
  ) => {
    // Calculate circle properties with more space for the text
    const center = size === 'sm' ? 24 : size === 'lg' ? 48 : 40;
    const padding = thickness + (size === 'sm' ? 6 : 8);
    const radius = center - padding + 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div
        ref={ref}
        className={cn(circularProgressVariants({ size, variant }), className)}
        {...props}
      >
        <svg className="h-full w-full -rotate-90">
          {/* Background circle */}
          <circle
            className="stroke-muted/25"
            fill="none"
            strokeWidth={thickness}
            cx={center}
            cy={center}
            r={radius}
          />
          {/* Progress circle */}
          <circle
            className={cn('transition-all duration-300 ease-in-out', {
              'stroke-primary': variant === 'default',
              'stroke-green-500': variant === 'success',
              'stroke-yellow-500': variant === 'warning',
              'stroke-red-500': variant === 'danger',
            })}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            cx={center}
            cy={center}
            r={radius}
          />
        </svg>
        {showValue && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn(
                'font-semibold',
                size === 'sm'
                  ? 'text-xs'
                  : size === 'lg'
                    ? 'text-base'
                    : 'text-sm',
              )}
            >
              {Math.round(value)}%
            </span>
          </div>
        )}
      </div>
    );
  },
);

CircularProgress.displayName = 'CircularProgress';

export { CircularProgress };
