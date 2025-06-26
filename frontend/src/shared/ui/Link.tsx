import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

const linkVariants = cva(
  'text-icmop-primary transition-colors duration-200 hover:text-icmop-dark hover:underline',
  {
    variants: {
      size: {
        default: 'text-sm sm:text-base', // Corresponds to .link
        sm: 'text-xs sm:text-sm',      // Corresponds to .form-link
      },
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface LinkProps
  extends RouterLinkProps,
    VariantProps<typeof linkVariants> {}

const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <RouterLink
        ref={ref}
        className={cn(linkVariants({ size, className }))}
        {...props}
      />
    );
  }
);
Link.displayName = 'Link';

export { Link, linkVariants }; 