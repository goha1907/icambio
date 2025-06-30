import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

/**
 * Варианты стилей для компонента Badge
 * Определяет различные типы меток с соответствующими цветами и стилями
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success:
          'border-transparent bg-success text-white hover:bg-success/80',
        info:
          'border-transparent bg-info text-white hover:bg-info/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Интерфейс пропсов для компонента Badge
 * Расширяет стандартные HTML атрибуты div элемента
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /** Вариант отображения метки */
  variant?: 'default' | 'secondary' | 'destructive' | 'success' | 'info' | 'outline';
}

/**
 * Компонент Badge для отображения небольших индикаторов или меток
 * Поддерживает различные варианты: default, secondary, destructive, success, info, outline
 * 
 * @example
 * <Badge variant="success">Активен</Badge>
 * <Badge variant="destructive">Ошибка</Badge>
 * <Badge variant="outline">Новый</Badge>
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants }; 