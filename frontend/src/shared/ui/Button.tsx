import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

/**
 * Варианты стилей для компонента Button
 * Определяет различные типы кнопок с соответствующими цветами, эффектами и состояниями
 */
const buttonVariants = cva(
  'items-center justify-center whitespace-nowrap rounded-lg text-sm sm:text-base font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'inline-flex bg-gradient-to-r from-icambio-primary to-icambio-dark text-white shadow-[0_2px_4px_rgba(0,166,81,0.2)] hover:shadow-[0_4px_12px_rgba(0,166,81,0.25)] hover:brightness-105',
        secondary:
          'inline-flex bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success:
          'inline-flex bg-success text-success-foreground shadow-[0_2px_4px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:bg-success/90',
        info:
          'inline-flex bg-info text-info-foreground shadow-[0_2px_4px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:bg-info/90',
        destructive:
          'inline-flex bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'inline-flex border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        // Мягкие (soft) варианты
        'primary-soft':
          'inline-flex bg-primary/10 text-primary hover:bg-primary/20',
        'success-soft':
          'inline-flex bg-success/10 text-success hover:bg-success/20',
        'destructive-soft':
          'inline-flex bg-destructive/10 text-destructive hover:bg-destructive/20',
        'info-soft':
          'inline-flex bg-info/10 text-info hover:bg-info/20',
        'secondary-soft':
          'inline-flex bg-secondary/10 text-secondary hover:bg-secondary/20',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        text: 'text-gray-600 hover:text-icambio-primary',
        link: 'inline-flex text-icambio-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'px-4 py-2 sm:px-6 sm:py-2.5',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

/**
 * Интерфейс пропсов для компонента Button
 * Расширяет стандартные HTML атрибуты button элемента
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Использовать ли Slot для композиции с другими компонентами */
  asChild?: boolean;
  /** Показать индикатор загрузки и отключить кнопку */
  isLoading?: boolean;
  /** Иконка слева от текста */
  leftIcon?: React.ReactNode;
  /** Иконка справа от текста */
  rightIcon?: React.ReactNode;
}

/**
 * Компонент Button для создания интерактивных кнопок
 * Поддерживает различные варианты стилей, размеры и композицию через asChild
 * 
 * @example
 * // Основная кнопка
 * <Button variant="primary">Сохранить</Button>
 * 
 * @example
 * // Кнопка-иконка
 * <Button variant="ghost" size="icon">
 *   <Icon className="h-4 w-4" />
 * </Button>
 * 
 * @example
 * // Композиция с Link
 * <Button asChild>
 *   <Link to="/profile">Профиль</Link>
 * </Button>
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size }),
          isLoading && 'cursor-wait',
          className,
        )}
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {rightIcon && <span className="ml-2">{rightIcon}</span>}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants }; 