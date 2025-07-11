"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/shared/lib/utils"

/**
 * Корневой компонент всплывающего окна (popover).
 * Управляет состоянием открытия/закрытия и предоставляет контекст дочерним компонентам.
 */
const Popover = PopoverPrimitive.Root

/**
 * PopoverTrigger — элемент, по взаимодействию с которым открывается всплывающее окно.
 * Чаще всего используется с `asChild`, чтобы обернуть кнопку или ссылку.
 * 
 * @example
 * <Popover>
 *   <PopoverTrigger asChild>
 *     <Button>Открыть</Button>
 *   </PopoverTrigger>
 *   <PopoverContent>...</PopoverContent>
 * </Popover>
 */
const PopoverTrigger = PopoverPrimitive.Trigger

/**
 * PopoverContent — контейнер для содержимого всплывающего окна.
 * Поддерживает выравнивание (`align`), позицию (`side`) и смещение (`sideOffset`).
 */
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-auto rounded-md border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

/**
 * # Пример использования
 * 
 * ```tsx
 * import { Popover, PopoverTrigger, PopoverContent } from '@/shared/ui/Popover';
 * import { Button } from '@/shared/ui/Button';
 * 
 * function Example() {
 *   return (
 *     <Popover>
 *       <PopoverTrigger asChild>
 *         <Button variant="outline">Открыть поповер</Button>
 *       </PopoverTrigger>
 *       <PopoverContent className="p-4 max-w-sm" side="bottom" align="center">
 *         <p className="text-sm text-muted-foreground">
 *           Это произвольное содержимое popover. Здесь можно разместить любой JSX: формы,
 *           меню или просто текст.
 *         </p>
 *       </PopoverContent>
 *     </Popover>
 *   );
 * }
 * ```
 */

export { Popover, PopoverTrigger, PopoverContent }