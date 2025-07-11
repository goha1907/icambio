import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

import { cn } from '@/shared/lib/utils';

/**
 * Варианты стилей для компонента Alert
 * Определяет различные типы уведомлений с соответствующими цветами и стилями
 */
const alertVariants = cva(
  'w-full rounded-lg border p-4 flex gap-3 items-start',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive text-destructive dark:border-destructive [&>svg]:text-destructive',
        success:
          'border-success text-success-foreground dark:border-success [&>svg]:text-success',
        info: 'border-info text-info-foreground dark:border-info [&>svg]:text-info',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Мапинг иконок для каждого варианта Alert
 * Каждый тип уведомления имеет соответствующую иконку
 */
const ICONS: Record<
  NonNullable<VariantProps<typeof alertVariants>['variant']>,
  React.ElementType
> = {
  default: Info,
  destructive: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

/**
 * Alert – универсальный компонент уведомлений.
 * 
 * @example
 * ```tsx
 * <Alert variant="success">
 *   <AlertTitle>Успех!</AlertTitle>
 *   <AlertDescription>Данные сохранены.</AlertDescription>
 * </Alert>
 * ```
 */
const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof alertVariants> & { showIcon?: boolean }
>(({ className, variant, showIcon = true, children, ...props }, ref) => {
    const Icon = variant ? ICONS[variant] : ICONS.default;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
      {showIcon && <Icon className="h-4 w-4 shrink-0" />}
      <div className="flex-1">{children}</div>
      </div>
    );
});
Alert.displayName = 'Alert';

/**
 * Компонент для заголовка уведомления
 */
const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
));
AlertTitle.displayName = 'AlertTitle';

/**
 * Компонент для описания/содержимого уведомления
 */
const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
