import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

/**
 * Варианты стилей для компонента PageTitle
 * Определяет различные размеры заголовков и варианты выравнивания
 */
const pageTitleVariants = cva(
  // Базовые стили - общие для всех вариантов
  'mb-8',
  {
    variants: {
      /**
       * Размеры заголовка
       * - sm: маленький заголовок для второстепенных страниц
       * - md: средний заголовок (по умолчанию)
       * - lg: большой заголовок для главных страниц
       * - xl: очень большой заголовок для лендингов
       */
      size: {
        sm: '[&_h1]:text-xl [&_h1]:font-semibold [&_p]:text-xs',
        md: '[&_h1]:text-2xl [&_h1]:font-bold [&_p]:text-sm',
        lg: '[&_h1]:text-3xl [&_h1]:font-bold [&_p]:text-base',
        xl: '[&_h1]:text-4xl [&_h1]:font-bold [&_p]:text-lg',
      },
      /**
       * Выравнивание содержимого
       * - left: выравнивание по левому краю с кнопками справа
       * - center: центрированное выравнивание
       */
      align: {
        left: '',
        center: 'text-center [&>div]:justify-center',
      },
    },
    defaultVariants: {
      size: 'lg',
      align: 'left',
    },
  }
);

/**
 * Интерфейс пропсов для компонента PageTitle
 * Расширяет стандартные HTML атрибуты div элемента
 */
interface PageTitleProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pageTitleVariants> {
  /** Основной заголовок страницы */
  title: string;
  /** Дополнительное описание под заголовком (опционально) */
  description?: string;
  /** Дополнительные элементы справа от заголовка (кнопки, ссылки) */
  children?: React.ReactNode;
  /** Размер заголовка */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Выравнивание содержимого */
  align?: 'left' | 'center';
}

/**
 * PageTitle — семантический компонент для отображения заголовков страниц.
 * 
 * Обеспечивает единообразные размеры, выравнивание, описание и возможность
 * размещать дополнительные элементы (кнопки, ссылки) рядом с заголовком.
 * 
 * @param {PageTitleProps} props               Параметры компонента
 * @param {string}          props.title        Основной заголовок страницы
 * @param {string}          [props.description]Описание, отображаемое под заголовком
 * @param {'sm'|'md'|'lg'|'xl'} [props.size]   Размер заголовка (по умолчанию `'lg'`)
 * @param {'left'|'center'}   [props.align]    Выравнивание содержимого (по умолчанию `'left'`)
 * @param {React.ReactNode}   [props.children] Дополнительные элементы (кнопки, ссылки)
 * @param {string}            [props.className]Дополнительные CSS-классы
 * @returns {React.ReactElement} JSX-элемент
 * 
 * @example
 * // 1. Простой заголовок
 * <PageTitle title="Личный кабинет" />
 * 
 * @example
 * // 2. Заголовок с описанием
 * <PageTitle 
 *   title="Создать заявку" 
 *   description="Заполните форму для создания новой заявки"
 * />
 * 
 * @example
 * // 3. Заголовок с кнопкой
 * <PageTitle title="Заказы">
 *   <Button variant="primary">Создать заказ</Button>
 * </PageTitle>
 * 
 * @example
 * // 4. Центрированный заголовок большого размера
 * <PageTitle 
 *   title="Добро пожаловать" 
 *   align="center"
 *   size="xl"
 * />
 */
const PageTitle = React.forwardRef<HTMLDivElement, PageTitleProps>(
  ({ title, description, children, size, align, className, ...props }, ref) => {
    return (
      <div 
        ref={ref} 
        className={cn(pageTitleVariants({ size, align }), className)} 
        {...props}
      >
        <div className="flex items-center justify-between">
          <div className={cn(align === 'center' && 'flex-1')}>
            {/* Основной заголовок страницы */}
            <h1 className="text-foreground">
              {title}
            </h1>
            {/* Описание под заголовком (если передано) */}
            {description && (
              <p className="mt-2 text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {/* Дополнительные элементы справа (кнопки, ссылки) */}
          {children && align === 'left' && (
            <div className="flex items-center space-x-4">
              {children}
            </div>
          )}
        </div>
        {/* Для центрированного выравнивания показываем children снизу */}
        {children && align === 'center' && (
          <div className="mt-6 flex justify-center items-center space-x-4">
            {children}
          </div>
        )}
      </div>
    );
  },
);

PageTitle.displayName = 'PageTitle';

// Экспортируем также варианты стилизации для единообразия с другими UI-компонентами
export { PageTitle, pageTitleVariants, type PageTitleProps };
