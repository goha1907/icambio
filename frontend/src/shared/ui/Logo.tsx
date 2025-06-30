import { Link } from 'react-router-dom';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Варианты стилизации логотипа
 * Управляет размерами и цветовыми схемами логотипа
 */
const logoVariants = cva('w-auto object-contain transition-opacity duration-200', {
  variants: {
    /**
     * Размеры логотипа
     * - xs: Очень маленький (24px) - для мобильных меню
     * - sm: Маленький (32px) - для компактных интерфейсов  
     * - md: Средний (48px) - основной размер для хедера
     * - lg: Большой (64px) - для главной страницы
     * - xl: Очень большой (96px) - для splash экранов
     */
    size: {
      xs: 'h-6',
      sm: 'h-8', 
      md: 'h-12',
      lg: 'h-16',
      xl: 'h-24',
    },
    /**
     * Цветовые варианты логотипа
     * - default: Обычный цвет (для светлых фонов)
     * - white: Белый логотип (для темных фонов)
     * - muted: Приглушенный вариант (для второстепенных мест)
     */
    variant: {
      default: 'opacity-100',
      white: 'brightness-0 invert opacity-100',
      muted: 'opacity-70',
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'default',
  },
});

/**
 * Интерфейс пропсов компонента Logo
 */
export interface LogoProps extends VariantProps<typeof logoVariants> {
  /** Дополнительные CSS классы */
  className?: string;
  /** Отключить ссылку на главную (только изображение) */
  disableLink?: boolean;
  /** Кастомный alt текст для изображения */
  alt?: string;
}

/**
 * Компонент логотипа iCambio
 * 
 * Отображает векторный логотип компании с возможностью настройки размера,
 * цветовой схемы и поведения ссылки.
 * 
 * @example
 * ```tsx
 * // Обычный логотип в хедере
 * <Logo size="md" />
 * 
 * // Большой логотип на главной странице
 * <Logo size="xl" className="mx-auto" />
 * 
 * // Белый логотип для темного фона
 * <Logo variant="white" size="lg" />
 * 
 * // Только изображение без ссылки
 * <Logo disableLink size="sm" />
 * ```
 */
export const Logo = ({ 
  className, 
  size, 
  variant, 
  disableLink = false,
  alt = "iCambio - обменник валют"
}: LogoProps) => {
  /**
   * Компонент изображения логотипа
   * Использует векторный SVG для лучшего качества на всех экранах
   */
  const logoImage = (
    <img
      src="/Logo.svg"
      alt={alt}
      className={cn(logoVariants({ size, variant }))}
      loading="eager" // Логотип должен загружаться сразу
      decoding="sync" // Синхронная декодировка для быстрого отображения
    />
  );

  // Если отключена ссылка, возвращаем только изображение
  if (disableLink) {
    return (
      <div className={cn('flex items-center', className)}>
        {logoImage}
      </div>
    );
  }

  /**
   * Логотип с ссылкой на главную страницу
   * Включает правильные ARIA-атрибуты для accessibility
   */
  return (
    <Link 
      to="/" 
      className={cn(
        'flex items-center transition-opacity duration-200 hover:opacity-80 focus:opacity-80 focus:outline-none focus:ring-2 focus:ring-icmop-primary focus:ring-offset-2 rounded-sm',
        className
      )}
      aria-label="Перейти на главную страницу iCambio"
    >
      {logoImage}
    </Link>
  );
}; 