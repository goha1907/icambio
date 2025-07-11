import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/lib/utils';

// -----------------------------------------------------------------------------
// Variants
// -----------------------------------------------------------------------------

const checkboxVariants = cva(
  // Базовые utility-классы
  'peer h-4 w-4 shrink-0 rounded border bg-white shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'border-input text-primary-foreground focus-visible:ring-ring data-[state=checked]:bg-icambio-primary data-[state=checked]:text-primary-foreground',
        destructive:
          'border-destructive text-destructive-foreground focus-visible:ring-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

/**
 * Компонент Checkbox на базе Radix UI.
 * Полностью управляемый извне (`checked`, `onCheckedChange`).
 * Имеет два варианта: `default` и `destructive` (красная рамка и ring для ошибок валидации).
 * 
 * Пример использования с `Label` (лучшие UX-практики):
 * ```tsx
 * <form>
 *   <div className="flex items-center gap-2">
 *     <Checkbox id="terms" checked={value} onCheckedChange={setValue} />
 *     <Label htmlFor="terms">Я принимаю условия сервиса</Label>
 *   </div>
 * </form>
 * ```
 */
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(checkboxVariants({ variant }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox, checkboxVariants }; 