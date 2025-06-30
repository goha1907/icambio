"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Варианты стилей для SelectTrigger
 * Определяет различные размеры и состояния выпадающего списка
 */
const selectTriggerVariants = cva(
  // Базовые стили - общие для всех вариантов
  "flex w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      /**
       * Варианты состояний
       * - default: стандартное состояние
       * - error: состояние ошибки с красной границей
       * - success: состояние успеха с зеленой границей
       */
      variant: {
        default: "border-input hover:border-muted-foreground focus:border-icmop-primary focus:ring-ring",
        error: "border-destructive hover:border-destructive focus:border-destructive focus:ring-destructive",
        success: "border-success hover:border-success focus:border-success focus:ring-success",
      },
      /**
       * Размеры компонента
       * - sm: маленький размер для компактных форм
       * - md: средний размер (по умолчанию)
       * - lg: большой размер для главных элементов
       */
      size: {
        sm: "h-8 px-2 py-1 text-xs",
        md: "h-10 px-3 py-2 text-sm",
        lg: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

/**
 * Корневой компонент Select
 * Базовый контейнер для всего выпадающего списка
 */
const Select = SelectPrimitive.Root

/**
 * Компонент группировки элементов Select
 * Используется для логического объединения опций
 */
const SelectGroup = SelectPrimitive.Group

/**
 * Компонент отображения выбранного значения
 * Показывает текущее выбранное значение или placeholder
 */
const SelectValue = SelectPrimitive.Value

/**
 * Интерфейс пропсов для SelectTrigger
 */
interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectTriggerVariants> {
  /** Вариант состояния */
  variant?: "default" | "error" | "success"
  /** Размер компонента */
  size?: "sm" | "md" | "lg"
}

/**
 * Компонент SelectTrigger - кнопка для открытия выпадающего списка
 * 
 * Отображает выбранное значение и стрелку для открытия списка опций.
 * Поддерживает различные размеры и состояния для разных сценариев использования.
 * 
 * @example
 * // Базовое использование
 * <SelectTrigger>
 *   <SelectValue placeholder="Выберите опцию" />
 * </SelectTrigger>
 * 
 * @example
 * // С состоянием ошибки
 * <SelectTrigger variant="error">
 *   <SelectValue placeholder="Поле с ошибкой" />
 * </SelectTrigger>
 * 
 * @example
 * // Маленький размер
 * <SelectTrigger size="sm">
 *   <SelectValue placeholder="Компактный выбор" />
 * </SelectTrigger>
 */
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, children, variant, size, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(selectTriggerVariants({ variant, size }), className)}
    {...props}
  >
    {children}
    {/* Иконка стрелки для открытия списка */}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

/**
 * Компонент SelectContent - контейнер для списка опций
 * 
 * Отображает выпадающий список с опциями. Автоматически позиционируется
 * относительно триггера и поддерживает прокрутку для длинных списков.
 * 
 * @example
 * <SelectContent>
 *   <SelectItem value="option1">Опция 1</SelectItem>
 *   <SelectItem value="option2">Опция 2</SelectItem>
 * </SelectContent>
 */
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Базовые стили для выпадающего списка
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-lg border bg-white text-foreground shadow-lg",
        // Анимации появления/исчезновения
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        // Позиционирование
        position === "popper" &&
          "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

/**
 * Компонент SelectLabel - заголовок для группы опций
 * 
 * Используется для создания визуальных разделов в списке опций.
 * Не является интерактивным элементом.
 * 
 * @example
 * <SelectContent>
 *   <SelectLabel>Криптовалюты</SelectLabel>
 *   <SelectItem value="btc">Bitcoin</SelectItem>
 *   <SelectItem value="eth">Ethereum</SelectItem>
 * </SelectContent>
 */
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-1.5 pl-8 pr-2 text-sm font-semibold text-muted-foreground",
      className
    )}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

/**
 * Компонент SelectItem - отдельная опция в списке
 * 
 * Представляет одну опцию для выбора. Поддерживает клавиатурную навигацию,
 * отображение состояния выбора и может быть отключен.
 * 
 * @example
 * <SelectItem value="usd">US Dollar</SelectItem>
 * 
 * @example
 * // Отключенная опция
 * <SelectItem value="eur" disabled>
 *   Euro (недоступно)
 * </SelectItem>
 */
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Базовые стили для опции
      "relative flex w-full cursor-pointer select-none items-center rounded-md py-2 pl-8 pr-2 text-sm outline-none transition-colors duration-150",
      // Состояния наведения и фокуса
      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
      // Состояние отключения
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // Состояние выбора
      "data-[state=checked]:bg-icmop-primary/10 data-[state=checked]:text-icmop-primary data-[state=checked]:font-medium",
      className
    )}
    {...props}
  >
    {/* Индикатор выбранного элемента */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-icmop-primary" />
      </SelectPrimitive.ItemIndicator>
    </span>

    {/* Текст опции */}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

/**
 * Компонент SelectSeparator - разделитель между группами опций
 * 
 * Визуальный разделитель для создания логических групп в списке опций.
 * 
 * @example
 * <SelectContent>
 *   <SelectItem value="crypto1">Bitcoin</SelectItem>
 *   <SelectSeparator />
 *   <SelectItem value="fiat1">USD</SelectItem>
 * </SelectContent>
 */
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  type SelectTriggerProps,
} 