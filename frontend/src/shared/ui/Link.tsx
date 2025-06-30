import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

/**
 * Варианты стилей для Link компонента
 * Определяет различные визуальные состояния ссылок
 */
const linkVariants = cva(
  // Базовые стили - общие для всех вариантов
  'transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-icmop-primary',
  {
    variants: {
      /**
       * Визуальные варианты ссылки
       * - primary: основной стиль с зеленым цветом проекта
       * - secondary: вторичный стиль с темным цветом
       * - muted: приглушенная ссылка для второстепенной информации
       * - danger: красная ссылка для опасных действий
       */
      variant: {
        primary: 'text-icmop-primary hover:text-icmop-dark',
        secondary: 'text-foreground hover:text-icmop-primary',
        muted: 'text-muted-foreground hover:text-foreground',
        danger: 'text-destructive hover:text-destructive/80',
      },
      /**
       * Размеры ссылки
       * - xs: очень маленький размер для подписей
       * - sm: маленький размер для форм и навигации
       * - default: стандартный размер для основного контента
       * - lg: увеличенный размер для заголовков
       */
      size: {
        xs: 'text-xs',
        sm: 'text-xs sm:text-sm',
        default: 'text-sm sm:text-base',
        lg: 'text-base sm:text-lg',
      },
      /**
       * Стиль подчеркивания
       * - hover: подчеркивание только при наведении (по умолчанию)
       * - always: всегда подчеркнутая ссылка
       * - none: без подчеркивания
       */
      underline: {
        hover: 'no-underline hover:underline',
        always: 'underline',
        none: 'no-underline hover:no-underline',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
      underline: 'hover',
    },
  }
);

/**
 * Пропсы для Link компонента
 * Расширяет стандартные пропсы React Router Link с дополнительными вариантами
 */
export interface LinkProps
  extends Omit<RouterLinkProps, 'to'>,
    VariantProps<typeof linkVariants> {
  /**
   * Путь для навигации или внешняя ссылка
   * @example to="/profile" // Внутренняя навигация
   * @example to="https://example.com" // Внешняя ссылка
   */
  to: string;
  
  /**
   * Дополнительные CSS классы
   * @example className="font-bold ml-2"
   */
  className?: string;
  
  /**
   * Визуальный вариант ссылки
   * @default "primary"
   * @example variant="secondary" // Темная ссылка
   * @example variant="muted" // Приглушенная ссылка
   * @example variant="danger" // Красная ссылка для удаления
   */
  variant?: 'primary' | 'secondary' | 'muted' | 'danger';
  
  /**
   * Размер ссылки
   * @default "default"
   * @example size="sm" // Маленький размер для форм
   * @example size="lg" // Большой размер для заголовков
   */
  size?: 'xs' | 'sm' | 'default' | 'lg';
  
  /**
   * Стиль подчеркивания
   * @default "hover"
   * @example underline="always" // Всегда подчеркнутая
   * @example underline="none" // Без подчеркивания
   */
  underline?: 'hover' | 'always' | 'none';
  
  /**
   * Дочерние элементы
   */
  children: React.ReactNode;
}

/**
 * Проверяет, является ли ссылка внешней
 */
const isExternalLink = (to: string): boolean => {
  return to.startsWith('http://') || to.startsWith('https://') || to.startsWith('mailto:') || to.startsWith('tel:');
};

/**
 * Link - универсальный компонент для навигации
 * 
 * Автоматически определяет тип ссылки (внутренняя/внешняя) и применяет
 * соответствующие атрибуты безопасности. Поддерживает различные визуальные
 * варианты и размеры для разных контекстов использования.
 * 
 * @example
 * // Внутренняя ссылка (основной стиль)
 * <Link to="/profile">
 *   Мой профиль
 * </Link>
 * 
 * @example
 * // Внешняя ссылка (автоматически добавляет target="_blank")
 * <Link to="https://example.com">
 *   Внешний сайт
 * </Link>
 * 
 * @example
 * // Ссылка с вариантами стилизации
 * <Link to="/help" variant="muted" size="sm">
 *   Справка
 * </Link>
 * 
 * @example
 * // Опасная ссылка (удаление, выход)
 * <Link to="/logout" variant="danger" underline="none">
 *   Выйти из аккаунта
 * </Link>
 * 
 * @example
 * // Ссылка в навигации
 * <Link to="/exchange" variant="secondary" size="lg">
 *   Обмен валют
 * </Link>
 * 
 * @example
 * // Ссылка в форме
 * <Link to="/forgot-password" size="sm">
 *   Забыли пароль?
 * </Link>
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, size, underline, to, children, ...props }, ref) => {
    const isExternal = isExternalLink(to);
    
    // Для внешних ссылок используем обычный <a> элемент
    if (isExternal) {
      return (
        <a
          ref={ref}
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(linkVariants({ variant, size, underline }), className)}
          {...props}
        >
          {children}
        </a>
      );
    }
    
    // Для внутренних ссылок используем React Router Link
    return (
      <RouterLink
        ref={ref}
        to={to}
        className={cn(linkVariants({ variant, size, underline }), className)}
        {...props}
      >
        {children}
      </RouterLink>
    );
  }
);

// Устанавливаем отображаемое имя для React DevTools
Link.displayName = 'Link';

export { Link, linkVariants }; 