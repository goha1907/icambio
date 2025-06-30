import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Варианты стилей для Loader компонента
 * Определяет различные типы индикаторов загрузки
 */
const loaderVariants = cva(
  // Базовые стили - общие для всех вариантов
  'inline-block',
  {
    variants: {
      /**
       * Тип анимации загрузки
       * - spinner: вращающийся круг (классический)
       * - dots: анимированные точки
       * - pulse: пульсирующий эффект
       * - bars: анимированные полоски
       */
      variant: {
        spinner: 'animate-spin rounded-full border-4 border-current border-t-transparent',
        dots: 'flex space-x-1',
        pulse: 'animate-pulse rounded-full bg-current',
        bars: 'flex space-x-1',
      },
      /**
       * Размеры индикатора загрузки
       * - xs: очень маленький для кнопок и иконок
       * - sm: маленький для инлайн элементов
       * - md: средний для карточек и форм
       * - lg: большой для страниц
       * - xl: очень большой для полноэкранных загрузок
       */
      size: {
        xs: '',
        sm: '',
        md: '',
        lg: '',
        xl: '',
      },
      /**
       * Цветовые схемы
       * - primary: основной зеленый цвет проекта
       * - secondary: темный цвет
       * - muted: приглушенный серый
       * - white: белый для темных фонов
       */
      color: {
        primary: 'text-icmop-primary',
        secondary: 'text-foreground',
        muted: 'text-muted-foreground',
        white: 'text-white',
      },
    },
    compoundVariants: [
      // Размеры для spinner
      { variant: 'spinner', size: 'xs', class: 'h-3 w-3 border-2' },
      { variant: 'spinner', size: 'sm', class: 'h-4 w-4 border-2' },
      { variant: 'spinner', size: 'md', class: 'h-8 w-8 border-4' },
      { variant: 'spinner', size: 'lg', class: 'h-12 w-12 border-4' },
      { variant: 'spinner', size: 'xl', class: 'h-16 w-16 border-4' },
      
      // Размеры для dots
      { variant: 'dots', size: 'xs', class: 'text-xs' },
      { variant: 'dots', size: 'sm', class: 'text-sm' },
      { variant: 'dots', size: 'md', class: 'text-base' },
      { variant: 'dots', size: 'lg', class: 'text-lg' },
      { variant: 'dots', size: 'xl', class: 'text-xl' },
      
      // Размеры для pulse
      { variant: 'pulse', size: 'xs', class: 'h-3 w-3' },
      { variant: 'pulse', size: 'sm', class: 'h-4 w-4' },
      { variant: 'pulse', size: 'md', class: 'h-8 w-8' },
      { variant: 'pulse', size: 'lg', class: 'h-12 w-12' },
      { variant: 'pulse', size: 'xl', class: 'h-16 w-16' },
      
      // Размеры для bars
      { variant: 'bars', size: 'xs', class: 'h-3' },
      { variant: 'bars', size: 'sm', class: 'h-4' },
      { variant: 'bars', size: 'md', class: 'h-8' },
      { variant: 'bars', size: 'lg', class: 'h-12' },
      { variant: 'bars', size: 'xl', class: 'h-16' },
    ],
    defaultVariants: {
      variant: 'spinner',
      size: 'md',
      color: 'primary',
    },
  },
);

/**
 * Пропсы для Loader компонента
 * Расширяет стандартные HTML атрибуты div элемента
 */
export interface LoaderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loaderVariants> {
  /**
   * Дополнительные CSS классы
   * @example className="mx-auto my-4"
   */
  className?: string;
  
  /**
   * Тип анимации загрузки
   * @default "spinner"
   * @example variant="dots" // Анимированные точки
   * @example variant="pulse" // Пульсирующий эффект
   * @example variant="bars" // Анимированные полоски
   */
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  
  /**
   * Размер индикатора
   * @default "md"
   * @example size="sm" // Для инлайн элементов
   * @example size="lg" // Для страниц
   * @example size="xl" // Для полноэкранных загрузок
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Цветовая схема
   * @default "primary"
   * @example color="white" // Для темных фонов
   * @example color="muted" // Приглушенный стиль
   */
  color?: 'primary' | 'secondary' | 'muted' | 'white';
  
  /**
   * Кастомный текст для screen readers
   * @default "Загрузка..."
   * @example loadingText="Сохранение данных..."
   */
  loadingText?: string;
  
  /**
   * Показывать ли текст загрузки визуально
   * @default false
   * @example showText={true} // Покажет текст под индикатором
   */
  showText?: boolean;
}

/**
 * Компонент для отображения точек (dots variant)
 */
const DotsLoader = ({ size, color }: { size: string; color: string }) => {
  const dotClass = cn(
    'rounded-full bg-current animate-pulse',
    size === 'xs' ? 'w-1 h-1' : 
    size === 'sm' ? 'w-1.5 h-1.5' :
    size === 'md' ? 'w-2 h-2' :
    size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'
  );
  
  return (
    <>
      <div className={cn(dotClass, color)} style={{ animationDelay: '0ms' }} />
      <div className={cn(dotClass, color)} style={{ animationDelay: '150ms' }} />
      <div className={cn(dotClass, color)} style={{ animationDelay: '300ms' }} />
    </>
  );
};

/**
 * Компонент для отображения полосок (bars variant)
 */
const BarsLoader = ({ size, color }: { size: string; color: string }) => {
  const barClass = cn(
    'bg-current animate-pulse rounded-sm',
    size === 'xs' ? 'w-0.5' : 
    size === 'sm' ? 'w-1' :
    size === 'md' ? 'w-1.5' :
    size === 'lg' ? 'w-2' : 'w-3'
  );
  
  return (
    <>
      <div className={cn(barClass, color)} style={{ animationDelay: '0ms' }} />
      <div className={cn(barClass, color)} style={{ animationDelay: '100ms' }} />
      <div className={cn(barClass, color)} style={{ animationDelay: '200ms' }} />
      <div className={cn(barClass, color)} style={{ animationDelay: '300ms' }} />
    </>
  );
};

/**
 * Loader - универсальный индикатор загрузки
 * 
 * Предоставляет различные типы анимаций загрузки для разных контекстов.
 * Поддерживает accessibility с правильными ARIA атрибутами и screen reader текстом.
 * 
 * @example
 * // Базовый spinner (по умолчанию)
 * <Loader />
 * 
 * @example
 * // Маленький spinner для кнопок
 * <Loader size="sm" />
 * 
 * @example
 * // Большой spinner для страниц
 * <Loader size="lg" />
 * 
 * @example
 * // Анимированные точки
 * <Loader variant="dots" color="muted" />
 * 
 * @example
 * // Пульсирующий индикатор
 * <Loader variant="pulse" size="xl" />
 * 
 * @example
 * // Полоски для компактных мест
 * <Loader variant="bars" size="sm" />
 * 
 * @example
 * // С видимым текстом загрузки
 * <Loader 
 *   showText={true} 
 *   loadingText="Обработка заявки..."
 * />
 * 
 * @example
 * // Белый индикатор для темных фонов
 * <Loader color="white" size="lg" />
 * 
 * @example
 * // Полноэкранная загрузка
 * <div className="fixed inset-0 flex items-center justify-center bg-background/80">
 *   <Loader size="xl" showText={true} loadingText="Загрузка приложения..." />
 * </div>
 */
const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ 
    className, 
    variant = 'spinner', 
    size = 'md', 
    color = 'primary',
    loadingText = 'Загрузка...',
    showText = false,
    ...props 
  }, ref) => {
    
    const renderContent = () => {
      switch (variant) {
        case 'dots':
          return <DotsLoader size={size} color={color} />;
        case 'bars':
          return <BarsLoader size={size} color={color} />;
        case 'pulse':
          return null; // Стили применяются к самому div
        default: // spinner
          return <span className="sr-only">{loadingText}</span>;
      }
    };

    return (
      <div className={cn('flex flex-col items-center', className)}>
      <div
        ref={ref}
          className={cn(loaderVariants({ variant, size, color }))}
        role="status"
          aria-label={loadingText}
        {...props}
      >
          {renderContent()}
        </div>
        {showText && (
          <p className="mt-2 text-sm text-muted-foreground">{loadingText}</p>
        )}
      </div>
    );
  },
);

// Устанавливаем отображаемое имя для React DevTools
Loader.displayName = 'Loader';

export { Loader, loaderVariants };
