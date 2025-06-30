'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * Варианты стилей для TabsList
 * Определяет различные размеры и стили отображения вкладок
 */
const tabsListVariants = cva(
  // Базовые стили - общие для всех вариантов
  'inline-flex items-center justify-center',
  {
    variants: {
      /**
       * Варианты стилизации вкладок
       * - default: стандартные вкладки с нижней границей
       * - pills: вкладки в виде таблеток с фоном
       * - underline: минималистичные вкладки только с подчеркиванием
       */
      variant: {
        default: 'border-b border-border bg-transparent',
        pills: 'rounded-lg bg-muted p-1',
        underline: 'border-b border-border bg-transparent',
      },
      /**
       * Размеры вкладок
       * - sm: компактные вкладки для ограниченного пространства
       * - md: стандартные вкладки (по умолчанию)
       * - lg: большие вкладки для акцентирования
       */
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
      /**
       * Ориентация вкладок
       * - horizontal: горизонтальное расположение (по умолчанию)
       * - vertical: вертикальное расположение
       */
      orientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col w-fit',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      orientation: 'horizontal',
    },
  }
);

/**
 * Варианты стилей для TabsTrigger
 */
const tabsTriggerVariants = cva(
  // Базовые стили для триггеров
  'inline-flex items-center justify-center whitespace-nowrap font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-b-2 border-transparent px-3 py-2 text-muted-foreground hover:text-icmop-primary data-[state=active]:border-icmop-primary data-[state=active]:text-icmop-primary',
        pills: 'rounded-md px-3 py-1.5 text-muted-foreground hover:bg-background hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        underline: 'border-b-2 border-transparent px-2 py-2 text-muted-foreground hover:text-icmop-primary data-[state=active]:border-icmop-primary data-[state=active]:text-icmop-primary',
      },
      size: {
        sm: 'h-7 px-2 py-1 text-xs gap-1',
        md: 'h-9 px-3 py-2 text-sm gap-2',
        lg: 'h-11 px-4 py-2.5 text-base gap-2',
      },
      orientation: {
        horizontal: '',
        vertical: 'justify-start w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      orientation: 'horizontal',
    },
  }
);

/**
 * Корневой компонент Tabs
 * Базовый контейнер для всей системы вкладок
 */
const Tabs = TabsPrimitive.Root;

/**
 * Интерфейс пропсов для TabsList
 */
interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  /** Вариант стилизации */
  variant?: 'default' | 'pills' | 'underline';
  /** Размер вкладок */
  size?: 'sm' | 'md' | 'lg';
  /** Ориентация вкладок */
  orientation?: 'horizontal' | 'vertical';
}

/**
 * Компонент TabsList - контейнер для вкладок
 * 
 * Содержит список всех доступных вкладок. Поддерживает различные
 * стили оформления, размеры и ориентацию расположения.
 * 
 * @example
 * // Базовое использование
 * <TabsList>
 *   <TabsTrigger value="tab1">Вкладка 1</TabsTrigger>
 *   <TabsTrigger value="tab2">Вкладка 2</TabsTrigger>
 * </TabsList>
 * 
 * @example
 * // Вкладки в стиле таблеток
 * <TabsList variant="pills" size="sm">
 *   <TabsTrigger value="settings">Настройки</TabsTrigger>
 *   <TabsTrigger value="profile">Профиль</TabsTrigger>
 * </TabsList>
 * 
 * @example
 * // Вертикальные вкладки
 * <TabsList orientation="vertical">
 *   <TabsTrigger value="general">Общие</TabsTrigger>
 *   <TabsTrigger value="security">Безопасность</TabsTrigger>
 * </TabsList>
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, size, orientation, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, size, orientation }), className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * Интерфейс пропсов для TabsTrigger
 */
interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  /** Вариант стилизации */
  variant?: 'default' | 'pills' | 'underline';
  /** Размер триггера */
  size?: 'sm' | 'md' | 'lg';
  /** Ориентация */
  orientation?: 'horizontal' | 'vertical';
  /** Иконка для отображения рядом с текстом */
  icon?: React.ReactNode;
  /** Отображать только иконку без текста */
  iconOnly?: boolean;
  /** Состояние загрузки */
  loading?: boolean;
}

/**
 * Компонент TabsTrigger - кнопка переключения вкладки
 * 
 * Представляет отдельную вкладку, которую можно активировать.
 * Поддерживает иконки, различные размеры и состояния.
 * 
 * @example
 * // Простая вкладка
 * <TabsTrigger value="profile">Профиль</TabsTrigger>
 * 
 * @example
 * // Вкладка с иконкой
 * <TabsTrigger value="settings" icon={<Settings />}>
 *   Настройки
 * </TabsTrigger>
 * 
 * @example
 * // Только иконка
 * <TabsTrigger value="user" icon={<User />} iconOnly />
 * 
 * @example
 * // Состояние загрузки
 * <TabsTrigger value="data" loading>
 *   Загрузка данных
 * </TabsTrigger>
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, variant, size, orientation, icon, iconOnly, loading, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, size, orientation }), className)}
    disabled={loading || props.disabled}
    {...props}
  >
    <div className="flex items-center gap-2">
      {/* Иконка или индикатор загрузки */}
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      
      {/* Текст вкладки (скрывается если iconOnly) */}
      {!iconOnly && children}
    </div>
  </TabsPrimitive.Trigger>
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Интерфейс пропсов для TabsContent
 */
interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  /** Добавить отступы к контенту */
  padded?: boolean;
}

/**
 * Компонент TabsContent - содержимое вкладки
 * 
 * Отображает контент, связанный с активной вкладкой.
 * Поддерживает анимации появления и настройку отступов.
 * 
 * @example
 * <TabsContent value="profile">
 *   <div>Содержимое профиля</div>
 * </TabsContent>
 * 
 * @example
 * // С автоматическими отступами
 * <TabsContent value="settings" padded>
 *   <div>Настройки приложения</div>
 * </TabsContent>
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, padded, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-4 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      // Анимации появления контента
      'data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-95',
      // Отступы для контента
      padded && 'p-4 rounded-lg border bg-card',
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  type TabsListProps,
  type TabsTriggerProps,
  type TabsContentProps,
};
