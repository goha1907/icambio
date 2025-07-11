import { forwardRef, HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

// -----------------------------------------------------------------------------
// Варианты стилизации Card (цветовые темы, интерактивность, градиенты)
// -----------------------------------------------------------------------------

const cardVariants = cva(
  'rounded-lg border shadow-sm bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default: 'border bg-card',
        'success-soft': 'border-success/20 bg-success/10',
        'destructive-soft': 'border-destructive/20 bg-destructive/10',
        interactive: 'transition-shadow cursor-pointer hover:shadow-md',
        'gradient-primary':
          'border-transparent bg-gradient-to-r from-icambio-primary to-icambio-dark text-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

// -----------------------------------------------------------------------------
// Варианты отступов для секций Card (Header / Content / Footer)
// -----------------------------------------------------------------------------

const sectionPaddingVariants = cva('', {
  variants: {
    paddings: {
      default: 'p-6',
      compact: 'p-4',
      none: 'p-0',
    },
  },
  defaultVariants: {
    paddings: 'default',
  },
});

/**
 * Интерфейс пропсов для компонентов Card
 * Расширяет стандартные HTML атрибуты div элемента
 */
export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Отступы для секций внутри карточки */
  paddings?: 'default' | 'compact' | 'none';
}

/**
 * Основной компонент Card для группировки контента
 * Создает контейнер с закругленными углами, тенью и стилизацией
 * Поддерживает варианты `variant` и глобальную настройку отступов `paddings`.
 * 
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Заголовок карточки</CardTitle>
 *     <CardDescription>Описание карточки</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     Основное содержимое карточки
 *   </CardContent>
 * </Card>
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, paddings = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant }), className)}
      data-card-padding={paddings}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

/**
 * Компонент CardHeader для отображения заголовочной части карточки
 * Содержит отступы и вертикальное spacing для заголовка и описания
 */
export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, paddings = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5', sectionPaddingVariants({ paddings }), className)}
      {...props}
    />
  ),
);
CardHeader.displayName = 'CardHeader';

/**
 * Компонент CardTitle для отображения заголовка карточки
 * Использует семантический тег h3 с соответствующей типографикой
 */
export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

/**
 * Компонент CardDescription для отображения описания карточки
 * Показывает дополнительную информацию под заголовком с приглушенным цветом
 */
export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);
CardDescription.displayName = 'CardDescription';

/**
 * Компонент CardContent для основного содержимого карточки
 * Содержит отступы и является основной областью для контента
 */
export const CardContent = forwardRef<HTMLDivElement, CardProps>(
  ({ className, paddings = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(sectionPaddingVariants({ paddings }), className)}
      {...props}
    />
  ),
);
CardContent.displayName = 'CardContent';

/**
 * Компонент CardFooter для нижней части карточки
 * Обычно содержит кнопки действий или дополнительную информацию
 */
export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, paddings = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center', sectionPaddingVariants({ paddings }), className)}
      {...props}
    />
  ),
);
CardFooter.displayName = 'CardFooter'; 