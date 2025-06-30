"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Варианты стилей для Label компонента
 * Определяет различные визуальные состояния меток форм
 */
const labelVariants = cva(
  // Базовые стили - общие для всех вариантов
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      /**
       * Визуальные варианты метки
       * - default: стандартная метка с базовым цветом
       * - required: метка для обязательных полей с акцентом
       * - optional: метка для опциональных полей (приглушенная)
       * - error: метка для полей с ошибками (красная)
       */
      variant: {
        default: "text-foreground",
        required: "text-foreground after:content-['*'] after:text-destructive after:ml-1",
        optional: "text-muted-foreground",
        error: "text-destructive",
      },
      /**
       * Размеры метки
       * - sm: маленький размер для компактных форм
       * - default: стандартный размер
       * - lg: увеличенный размер для заголовков секций
       */
      size: {
        sm: "text-xs",
        default: "text-sm", 
        lg: "text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Пропсы для Label компонента
 * Расширяет стандартные пропсы Radix UI Label с дополнительными вариантами
 */
export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {
  /**
   * Дополнительные CSS классы
   * @example className="mb-2 text-center"
   */
  className?: string;
  
  /**
   * Визуальный вариант метки
   * @default "default"
   * @example variant="required" // Добавит красную звездочку
   * @example variant="optional" // Приглушенный цвет
   * @example variant="error" // Красный цвет для ошибок
   */
  variant?: 'default' | 'required' | 'optional' | 'error';
  
  /**
   * Размер метки
   * @default "default" 
   * @example size="sm" // Маленький размер
   * @example size="lg" // Увеличенный размер
   */
  size?: 'sm' | 'default' | 'lg';
}

/**
 * Label - семантическая метка для элементов формы
 * 
 * Использует Radix UI Label для обеспечения доступности и правильной связи
 * с элементами формы. Поддерживает различные визуальные варианты и размеры.
 * 
 * @example
 * // Обычная метка
 * <Label htmlFor="email">
 *   Email адрес
 * </Label>
 * 
 * @example
 * // Обязательное поле с автоматической звездочкой
 * <Label htmlFor="password" variant="required">
 *   Пароль
 * </Label>
 * 
 * @example
 * // Опциональное поле с приглушенным цветом
 * <Label htmlFor="phone" variant="optional">
 *   Телефон (необязательно)
 * </Label>
 * 
 * @example
 * // Метка с ошибкой
 * <Label htmlFor="email" variant="error">
 *   Email содержит ошибку
 * </Label>
 * 
 * @example
 * // Компактная метка для плотных форм
 * <Label htmlFor="code" size="sm">
 *   Код подтверждения
 * </Label>
 * 
 * @example
 * // Увеличенная метка для заголовков секций
 * <Label size="lg" className="block mb-4">
 *   Персональная информация
 * </Label>
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, variant, size, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant, size }), className)}
    {...props}
  />
))

// Устанавливаем отображаемое имя для React DevTools
Label.displayName = LabelPrimitive.Root.displayName

export { Label, labelVariants } 