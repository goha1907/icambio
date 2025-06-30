import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Варианты стилей для Input компонента
 * Определяет различные визуальные состояния поля ввода
 */
const inputVariants = cva(
  // Базовые стили - общие для всех вариантов
  'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      /**
       * Визуальные варианты поля ввода
       * - default: стандартное поле с зеленой фокусировкой
       * - success: поле с зеленой границей для успешной валидации  
       * - error: поле с красной границей для ошибок валидации
       */
      variant: {
        default: 'border-input hover:border-muted-foreground focus:border-icmop-primary focus-visible:ring-ring',
        success: 'border-success hover:border-success focus:border-success focus-visible:ring-success',
        error: 'border-destructive hover:border-destructive focus:border-destructive focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/**
 * Пропсы для Input компонента
 * Расширяет стандартные HTML атрибуты input элемента
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  /**
   * Дополнительные CSS классы
   * @example className="w-64 mb-4"
   */
  className?: string;
  
  /**
   * Визуальный вариант поля ввода
   * @default "default"
   * @example variant="success" // Зеленая граница
   * @example variant="error" // Красная граница для ошибок
   */
  variant?: 'default' | 'success' | 'error';
}

/**
 * Input - универсальное поле ввода текста
 * 
 * Основной компонент для ввода данных пользователем. Поддерживает все стандартные
 * HTML атрибуты input элемента, а также дополнительные варианты стилизации.
 * 
 * @example
 * // Обычное текстовое поле
 * <Input 
 *   type="text" 
 *   placeholder="Введите текст..." 
 * />
 * 
 * @example  
 * // Поле email с валидацией
 * <Input
 *   type="email"
 *   placeholder="email@example.com"
 *   variant={errors.email ? "error" : "default"}
 *   aria-invalid={!!errors.email}
 * />
 * 
 * @example
 * // Поле с успешной валидацией
 * <Input
 *   type="text"
 *   value={value}
 *   variant="success"
 *   onChange={handleChange}
 * />
 * 
 * @example
 * // Поле пароля с ref для фокуса
 * <Input
 *   ref={passwordRef}
 *   type="password"
 *   placeholder="Введите пароль"
 *   autoComplete="current-password"
 * />
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    // Автоматически определяем вариант на основе aria-invalid
    const computedVariant = props['aria-invalid'] ? 'error' : variant;
    
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: computedVariant }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);

// Устанавливаем отображаемое имя для React DevTools
Input.displayName = 'Input';

export { Input, inputVariants }; 