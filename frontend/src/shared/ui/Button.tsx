import { forwardRef } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Варианты стилей для компонента Button
 * Определяет различные типы кнопок с соответствующими цветами, эффектами и состояниями
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm sm:text-base font-medium ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-icmop-primary to-icmop-dark text-white shadow-[0_2px_4px_rgba(0,166,81,0.2)] hover:shadow-[0_4px_12px_rgba(0,166,81,0.25)] hover:brightness-105',
        secondary:
          'bg-gray-100 text-gray-700 hover:bg-gray-200 shadow-sm hover:shadow-md',
        success:
          'bg-success text-white shadow-[0_2px_4px_rgba(16,185,129,0.2)] hover:shadow-[0_4px_12px_rgba(16,185,129,0.25)] hover:bg-success/90',
        info:
          'bg-info text-white shadow-[0_2px_4px_rgba(59,130,246,0.2)] hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)] hover:bg-info/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        text: 'text-gray-600 hover:text-icmop-primary',
        link: 'text-icmop-primary underline-offset-4 hover:underline',
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
  /** Вариант отображения кнопки */
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'destructive' | 'outline' | 'ghost' | 'text' | 'link';
  /** Размер кнопки */
  size?: 'default' | 'sm' | 'lg' | 'icon';
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
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants }; 