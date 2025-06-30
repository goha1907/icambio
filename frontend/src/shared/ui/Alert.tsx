import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CheckCircle, Info, AlertTriangle } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Варианты стилей для компонента Alert
 * Определяет различные типы уведомлений с соответствующими цветами и стилями
 */
const alertVariants = cva(
  'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        success:
          'border-success/50 text-success-foreground dark:border-success [&>svg]:text-success',
        info: 'border-info/50 text-info-foreground dark:border-info [&>svg]:text-info',
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
 * Интерфейс пропсов для компонента Alert
 */
interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  /** Показывать ли иконку в уведомлении */
  showIcon?: boolean;
}

/**
 * Основной компонент Alert для отображения уведомлений
 * Поддерживает различные варианты: default, destructive, success, info
 */
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, showIcon = true, children, ...props }, ref) => {
    const Icon = variant ? ICONS[variant] : ICONS.default;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        {showIcon && Icon && <Icon className="h-4 w-4" />}
        <div>{children}</div>
      </div>
    );
  },
);
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
