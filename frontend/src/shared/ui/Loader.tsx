import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const loaderVariants = cva(
  'animate-spin rounded-full border-4 border-current border-t-transparent text-primary',
  {
    variants: {
      size: {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(loaderVariants({ size }), className)}
        role="status"
        aria-label="Загрузка"
        {...props}
      >
        <span className="sr-only">Загрузка...</span>
      </div>
    );
  },
);
Loader.displayName = 'Loader';

export { Loader };
