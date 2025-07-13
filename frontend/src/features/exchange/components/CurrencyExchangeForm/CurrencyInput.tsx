import { forwardRef } from 'react';
import { Input, type InputProps } from '@/shared/ui/Input';

/**
 * CurrencyInput – специализированный компонент для ввода денежных сумм.
 * Фильтрует ввод, разрешая только цифры и одну точку.
 */
export const CurrencyInput = forwardRef<HTMLInputElement, InputProps>(
  ({ onKeyPress, ...props }, ref) => {
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const char = e.key;
      const value = (e.target as HTMLInputElement).value;
      
      // Разрешаем: цифры, точку (только одну), backspace, delete, стрелки
      if (!/[\d.]/.test(char) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(char)) {
        e.preventDefault();
        return;
      }
      
      // Запрещаем вторую точку
      if (char === '.' && value.includes('.')) {
        e.preventDefault();
        return;
      }

      // Вызываем оригинальный onKeyPress если он есть
      if (onKeyPress) {
        onKeyPress(e);
      }
    };

    return <Input ref={ref} onKeyPress={handleKeyPress} {...props} />;
  }
);

CurrencyInput.displayName = 'CurrencyInput'; 