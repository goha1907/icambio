import { forwardRef } from 'react';
import { cn } from '@/shared/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const textareaVariants = cva(
  'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-input hover:border-muted-foreground focus-visible:ring-ring',
        success: 'border-success hover:border-success focus-visible:ring-success',
        error: 'border-destructive hover:border-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Интерфейс пропсов для компонента Textarea
 * Расширяет стандартные HTML атрибуты textarea элемента
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  /** 
   * Отключает возможность пользователя изменять размер поля.
   * Не управляет высотой автоматически.
   */
  autoResize?: boolean;
}

/**
 * Компонент Textarea для многострочного ввода текста
 * Использует единообразные стили с компонентом Input для консистентности.
 * Поддерживает варианты для состояний валидации.
 * 
 * @example
 * // Базовое использование
 * <Textarea placeholder="Введите комментарий..." />
 * 
 * @example
 * // С отключенным ресайзом
 * <Textarea autoResize placeholder="Адрес доставки..." />
 * 
 * @example
 * // В состоянии ошибки
 * <Textarea variant="error" aria-invalid={true} />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant, autoResize = false, ...props }, ref) => {
    // Автоматически определяем вариант на основе aria-invalid
    const computedVariant = props['aria-invalid'] ? 'error' : variant;

    return (
      <textarea
        className={cn(
          textareaVariants({ variant: computedVariant }),
          {
            'resize-none': autoResize,
            'resize-y': !autoResize,
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export { Textarea }; 