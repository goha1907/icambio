import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Интерфейс пропсов для компонентов Card
 * Расширяет стандартные HTML атрибуты div элемента
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Основной компонент Card для группировки контента
 * Создает контейнер с закругленными углами, тенью и стилизацией
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
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-lg border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

/**
 * Компонент CardHeader для отображения заголовочной части карточки
 * Содержит отступы и вертикальное spacing для заголовка и описания
 */
export const CardHeader = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
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
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);
CardContent.displayName = 'CardContent';

/**
 * Компонент CardFooter для нижней части карточки
 * Обычно содержит кнопки действий или дополнительную информацию
 */
export const CardFooter = forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
);
CardFooter.displayName = 'CardFooter'; 