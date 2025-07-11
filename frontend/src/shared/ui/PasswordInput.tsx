import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { Input, type InputProps } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { cn } from '@/shared/lib/utils';

/**
 * ## PasswordInput
 *
 * Компонент для ввода пароля, построенный на основе `Input` с добавлением
 * функциональности для переключения видимости пароля.
 *
 * Является "глупым" компонентом и может быть использован как в составе
 * `react-hook-form`, так и как самостоятельный управляемый компонент.
 *
 * @param {InputProps} props - Все пропсы, которые принимает стандартный `Input`.
 *
 * @example
 * // Использование с react-hook-form
 * <FormField
 *   control={form.control}
 *   name="password"
 *   render={({ field }) => (
 *     <FormItem>
 *       <FormLabel>Пароль</FormLabel>
 *       <FormControl>
 *         <PasswordInput placeholder="••••••••" {...field} />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   )}
 * />
 *
 * @example
 * // Как самостоятельный управляемый компонент
 * const [password, setPassword] = React.useState('');
 * <PasswordInput
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 * />
 */
const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput }; 