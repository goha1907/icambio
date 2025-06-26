import { Link } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const logoVariants = cva('w-auto object-contain py-1', {
  variants: {
    size: {
      sm: 'h-10',
      md: 'h-12 sm:h-14',
      lg: 'h-20',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface LogoProps extends VariantProps<typeof logoVariants> {
  className?: string;
}

export const Logo = ({ className, size }: LogoProps) => {
  return (
    <Link to="/" className={cn('flex items-center', className)}>
      <img
        src="/logo.jpeg"
        alt="iCambio"
        className={cn(logoVariants({ size }))}
      />
    </Link>
  );
}; 