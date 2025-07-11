import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

/**
 * Варианты стилей для компонента Badge
 * Определяет различные типы меток с соответствующими цветами и стилями
 */
const badgeVariants = cva(
  // Базовые utility-классы, которые применяются всегда
  'inline-flex items-center rounded-full border font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      // Цветовые варианты
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        success:
          'border-transparent bg-success text-success-foreground hover:bg-success/80',
        info:
          'border-transparent bg-info text-info-foreground hover:bg-info/80',
        outline: 'text-foreground',

        // «Мягкие» варианты (светлый фон + основной цвет текста)
        'success-soft': 'border-transparent bg-success/10 text-success hover:bg-success/20',
        'destructive-soft':
          'border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20',
        'info-soft': 'border-transparent bg-info/10 text-info hover:bg-info/20',
        'secondary-soft':
          'border-transparent bg-secondary/10 text-secondary hover:bg-secondary/20',
      },

      // Размеры
      size: {
        sm: 'px-2 py-0.5 text-[10px]',
        md: 'px-2.5 py-0.5 text-xs',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

/**
 * Интерфейс пропсов для компонента Badge
 * Расширяет стандартные HTML атрибуты div элемента
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Badge – небольшой индикатор/метка.
 * Поддерживает цветовые `variant`-ы (в том числе «мягкие» soft-варианты)
 * и `size` (sm, md).
 * 
 * @example
 * <Badge>По умолчанию</Badge>
 * <Badge variant="success">Успех</Badge>
 * <Badge variant="success-soft">Успех (мягкий)</Badge>
 * <Badge variant="destructive" size="sm">Ошибка</Badge>
 */
function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
    );
}

export { Badge, badgeVariants }; 