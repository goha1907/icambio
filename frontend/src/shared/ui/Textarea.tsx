import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * Интерфейс пропсов для компонента Textarea
 * Расширяет стандартные HTML атрибуты textarea элемента
 */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Автоматическое изменение высоты под контент */
  autoResize?: boolean;
}

/**
 * Компонент Textarea для многострочного ввода текста
 * Использует единообразные стили с компонентом Input для консистентности
 * 
 * @example
 * // Базовое использование
 * <Textarea placeholder="Введите комментарий..." />
 * 
 * @example
 * // С автоматическим изменением размера
 * <Textarea autoResize placeholder="Адрес доставки..." />
 * 
 * @example
 * // В форме с валидацией
 * <FormField
 *   control={form.control}
 *   name="comment"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Комментарий</FormLabel>
 *       <FormControl>
 *         <Textarea placeholder="Ваш комментарий..." {...field} />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 */
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          // Базовые стили, идентичные Input компоненту
          'flex min-h-[80px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm ring-offset-background',
          // Стили для placeholder и файлов
          'placeholder:text-muted-foreground',
          // Анимации и переходы
          'transition-all duration-200 ease-in-out',
          // Hover состояния
          'hover:border-gray-400',
          // Focus состояния
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'focus:border-icmop-primary',
          // Disabled состояния
          'disabled:cursor-not-allowed disabled:opacity-50',
          // Состояние ошибки
          {
            'border-destructive focus-visible:ring-destructive': props['aria-invalid'],
          },
          // Автоматическое изменение размера
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