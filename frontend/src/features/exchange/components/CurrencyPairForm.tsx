import { useEffect, useMemo, useState } from 'react';
import { useWatch, useFormContext, Controller } from 'react-hook-form';
import { MOCK_CURRENCIES, MOCK_EXCHANGE_RATES } from '@/lib/mock-data';
import { ArrowRightLeft, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select';
import type { Currency } from '@/features/exchange/types';

interface CurrencyPairFormProps {
  index: number;
  isRemovable: boolean;
  onRemove: () => void;
}

export function CurrencyPairForm({ index, isRemovable, onRemove }: CurrencyPairFormProps) {
  const { control, setValue, watch, formState: { errors }, setError, clearErrors } = useFormContext();

  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);

  const pair = useWatch({
    control,
    name: `pairs.${index}`,
  });
  
  const { fromCurrency: fromCurrencyCode, toCurrency: toCurrencyCode, amount, result } = pair;

  // Получаем объекты валют
  const fromCurrency = useMemo(() => 
    MOCK_CURRENCIES.find(c => c.code === fromCurrencyCode),
    [fromCurrencyCode]
  );
  
  const toCurrency = useMemo(() => 
    MOCK_CURRENCIES.find(c => c.code === toCurrencyCode),
    [toCurrencyCode]
  );

  // Находим подходящий курс для отображения (ВСЕГДА показываем курс)
  const getExchangeRateForAmount = (currentAmount: number) => {
    if (!fromCurrencyCode || !toCurrencyCode) return null;

    const availableRates = MOCK_EXCHANGE_RATES.filter(
      (rate) =>
        rate.from_currency.code === fromCurrencyCode &&
        rate.to_currency.code === toCurrencyCode
    );

    if (availableRates.length === 0) return null;

    // Если сумма не указана или равна 0, показываем базовый курс (первый по минимальной сумме)
    if (!currentAmount || currentAmount <= 0) {
      return availableRates.sort((a, b) => a.minAmount - b.minAmount)[0];
    }

    // Ищем подходящий курс для данной суммы
    const suitableRates = availableRates.filter(
      rate => currentAmount >= rate.minAmount && (!rate.maxAmount || currentAmount <= rate.maxAmount)
    );

    if (suitableRates.length > 0) {
      // Возвращаем лучший курс для данной суммы
      return suitableRates.sort((a, b) => b.rate - a.rate)[0];
    }

    // Если сумма не попадает ни в один диапазон, находим ближайший
    if (currentAmount < availableRates[0].minAmount) {
      // Сумма меньше минимальной - показываем курс для минимальной суммы
      return availableRates.sort((a, b) => a.minAmount - b.minAmount)[0];
    } else {
      // Сумма больше максимальной - показываем курс для максимальной суммы
      return availableRates.sort((a, b) => (b.maxAmount || 0) - (a.maxAmount || 0))[0];
    }
  };

  // Текущий курс для отображения
  const exchangeRateData = useMemo(() => {
    const currentAmount = activeField === 'from' ? amount : 
                         activeField === 'to' ? result : 
                         amount || 0;
    return getExchangeRateForAmount(currentAmount);
  }, [fromCurrencyCode, toCurrencyCode, amount, result, activeField]);

  // Проверяем доступность направления обмена
  const isDirectionAvailable = useMemo(() => {
    if (!fromCurrencyCode || !toCurrencyCode) return true;
    
    return MOCK_EXCHANGE_RATES.some(
      rate => rate.from_currency.code === fromCurrencyCode && 
               rate.to_currency.code === toCurrencyCode
    );
  }, [fromCurrencyCode, toCurrencyCode]);

  // Получаем информацию о лимитах для отображения в placeholder
  const limitsInfo = useMemo(() => {
    if (!fromCurrencyCode || !toCurrencyCode) return null;
    
    const rates = MOCK_EXCHANGE_RATES.filter(
      rate => rate.from_currency.code === fromCurrencyCode && 
              rate.to_currency.code === toCurrencyCode
    );
    
    if (rates.length === 0) return null;
    
    const minAmount = Math.min(...rates.map(r => r.minAmount));
    const maxAmount = Math.max(...rates.map(r => r.maxAmount || Infinity));
    
    return { 
      minAmount, 
      maxAmount: maxAmount === Infinity ? undefined : maxAmount,
      symbol: fromCurrency?.symbol || ''
    };
  }, [fromCurrencyCode, toCurrencyCode, fromCurrency]);

  // Получаем информацию о лимитах для обратного направления
  const reverseLimitsInfo = useMemo(() => {
    if (!fromCurrencyCode || !toCurrencyCode) return null;
    
    const rates = MOCK_EXCHANGE_RATES.filter(
      rate => rate.from_currency.code === toCurrencyCode && 
              rate.to_currency.code === fromCurrencyCode
    );
    
    if (rates.length === 0) return null;
    
    const minAmount = Math.min(...rates.map(r => r.minAmount));
    const maxAmount = Math.max(...rates.map(r => r.maxAmount || Infinity));
    
    return { 
      minAmount, 
      maxAmount: maxAmount === Infinity ? undefined : maxAmount,
      symbol: toCurrency?.symbol || ''
    };
  }, [fromCurrencyCode, toCurrencyCode, toCurrency]);

  // Функция округления по decimal_digits валюты
  const formatCurrencyAmount = (amount: number, currency: Currency) => {
    const decimals = currency.decimal_digits;
    return parseFloat(amount.toFixed(decimals));
  };

  // Валидация ввода (только при blur или submit)
  const validateAmount = (value: number, isFromField: boolean) => {
    const fieldName = isFromField ? 'amount' : 'result';
    const limits = isFromField ? limitsInfo : reverseLimitsInfo;
    
    // Очищаем предыдущие ошибки
    clearErrors(`pairs.${index}.${fieldName}`);
    
    if (value <= 0) {
      setError(`pairs.${index}.${fieldName}`, {
        type: 'manual',
        message: 'Сумма должна быть больше 0'
      });
      return false;
    }
    
    if (limits) {
      if (value < limits.minAmount) {
        setError(`pairs.${index}.${fieldName}`, {
          type: 'manual',
          message: `Минимальная сумма: ${limits.symbol}${limits.minAmount.toLocaleString()}`
        });
        return false;
      }
      
      if (limits.maxAmount && value > limits.maxAmount) {
        setError(`pairs.${index}.${fieldName}`, {
          type: 'manual',
          message: `Максимальная сумма: ${limits.symbol}${limits.maxAmount.toLocaleString()}`
        });
        return false;
      }
    }
    
    return true;
  };

  // Валидация ввода символов (только цифры и точка)
  const handleKeyPress = (e: React.KeyboardEvent) => {
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
  };

  // Расчет результата (ВСЕГДА выполняется)
  useEffect(() => {
    if (!fromCurrencyCode || !toCurrencyCode || !exchangeRateData || activeField === null) return;
    
    const timeoutId = setTimeout(() => {
      if (activeField === 'from' && amount !== undefined && amount !== null && amount !== 0) {
        // Прямой расчет: получаете = отдаете * курс
        const calculatedResult = amount * exchangeRateData.rate;
        const formattedResult = formatCurrencyAmount(calculatedResult, toCurrency!);
        setValue(`pairs.${index}.result`, formattedResult, { shouldValidate: true });
      } else if (activeField === 'to' && result !== undefined && result !== null && result !== 0) {
        // Обратный расчет: отдаете = получаете / курс
        const calculatedAmount = result / exchangeRateData.rate;
        const formattedAmount = formatCurrencyAmount(calculatedAmount, fromCurrency!);
        setValue(`pairs.${index}.amount`, formattedAmount, { shouldValidate: true });
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [amount, result, exchangeRateData, activeField, fromCurrency, toCurrency, setValue, index, fromCurrencyCode, toCurrencyCode]);

  const handleSwap = () => {
    const from = watch(`pairs.${index}.fromCurrency`);
    const to = watch(`pairs.${index}.toCurrency`);
    
    setValue(`pairs.${index}.fromCurrency`, to);
    setValue(`pairs.${index}.toCurrency`, from);
    setValue(`pairs.${index}.amount`, 0);
    setValue(`pairs.${index}.result`, 0);
    setActiveField(null);
    
    // Очищаем ошибки при смене валют
    clearErrors(`pairs.${index}.amount`);
    clearErrors(`pairs.${index}.result`);
  };

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setValue(`pairs.${index}.amount`, numValue, { shouldValidate: true });
    if (value !== '') {
      setActiveField('from');
      setValue(`pairs.${index}.result`, 0);
    }
  };

  const handleResultChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setValue(`pairs.${index}.result`, numValue, { shouldValidate: true });
    if (value !== '') {
      setActiveField('to');
      setValue(`pairs.${index}.amount`, 0);
    }
  };

  const handleAmountFocus = () => {
    setActiveField('from');
    setValue(`pairs.${index}.result`, 0);
    clearErrors(`pairs.${index}.result`);
  };

  const handleResultFocus = () => {
    setActiveField('to');
    setValue(`pairs.${index}.amount`, 0);
    clearErrors(`pairs.${index}.amount`);
  };

  // Валидация при потере фокуса
  const handleAmountBlur = () => {
    if (amount !== undefined && amount !== null && amount !== 0) {
      validateAmount(amount, true);
    }
  };

  const handleResultBlur = () => {
    if (result !== undefined && result !== null && result !== 0) {
      validateAmount(result, false);
    }
  };

  const getFieldError = (fieldName: string) => {
    const pairsErrors = errors?.pairs as any;
    const error = pairsErrors?.[index]?.[fieldName];
    return error?.message as string;
  };

  // Создаем placeholder для поля "Отдаете"
  const getAmountPlaceholder = () => {
    if (!limitsInfo) return "0.00";
    const { minAmount, symbol } = limitsInfo;
    return `min: ${symbol}${minAmount.toLocaleString()}`;
  };

  // Создаем placeholder для поля "Получаете"
  const getResultPlaceholder = () => {
    if (!reverseLimitsInfo) return "0.00";
    const { minAmount, symbol } = reverseLimitsInfo;
    return `min: ${symbol}${minAmount.toLocaleString()}`;
  };

  // Определяем какой курс показывать
  const displayRate = exchangeRateData;
  const isHotRate = displayRate?.is_hot;

  return (
    <div className="relative">
      <div className="p-4 border rounded-lg bg-gray-50/50 hover:bg-gray-50/70 transition-colors">
        {/* Основная строка с полями и кнопкой обмена */}
        <div className="flex items-end gap-2">
          {/* Отдаете */}
      <div className="flex-1">
            <label 
              htmlFor={`from-currency-${index}`}
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Отдаете
            </label>
            <div className="flex gap-2">
              <div className="w-1/3">
             <Controller
              name={`pairs.${index}.fromCurrency`}
              control={control}
              render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      aria-label="Валюта отправления"
                    >
                      <SelectTrigger 
                        id={`from-currency-${index}`}
                        className={getFieldError('fromCurrency') ? 'border-red-500' : ''}
                        aria-describedby={getFieldError('fromCurrency') ? `from-currency-error-${index}` : undefined}
                      >
                    <SelectValue placeholder="Валюта" />
                  </SelectTrigger>
                  <SelectContent>
                        {MOCK_CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
              <div className="w-2/3">
            <Controller
              name={`pairs.${index}.amount`}
              control={control}
              render={({ field }) => (
                <Input 
                  type="number" 
                      placeholder={getAmountPlaceholder()}
                      step="0.01"
                      value={field.value || ''}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      onFocus={handleAmountFocus}
                      onBlur={handleAmountBlur}
                      onKeyPress={handleKeyPress}
                      className={getFieldError('amount') ? 'border-red-500' : ''}
                      aria-label="Сумма отправления"
                      aria-describedby={getFieldError('amount') ? `amount-error-${index}` : undefined}
                      autoFocus={index === 0}
                />
              )}
            />
          </div>
        </div>
      </div>

          {/* Кнопка обмена */}
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={handleSwap}
            className="bg-icmop-primary/10 text-icmop-primary hover:bg-icmop-primary/20 transition-colors"
            aria-label="Поменять валюты местами"
            disabled={!fromCurrencyCode || !toCurrencyCode}
          >
        <ArrowRightLeft className="h-4 w-4" />
      </Button>

          {/* Получаете */}
      <div className="flex-1">
            <label 
              htmlFor={`to-currency-${index}`}
              className="text-sm font-medium text-gray-700 mb-1 block"
            >
              Получаете
            </label>
            <div className="flex gap-2">
              <div className="w-1/3">
            <Controller
              name={`pairs.${index}.toCurrency`}
              control={control}
              render={({ field }) => (
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      aria-label="Валюта получения"
                    >
                      <SelectTrigger 
                        id={`to-currency-${index}`}
                        className={getFieldError('toCurrency') ? 'border-red-500' : ''}
                        aria-describedby={getFieldError('toCurrency') ? `to-currency-error-${index}` : undefined}
                      >
                    <SelectValue placeholder="Валюта" />
                  </SelectTrigger>
                  <SelectContent>
                        {MOCK_CURRENCIES.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} ({currency.symbol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
              <div className="w-2/3">
                <Controller
                  name={`pairs.${index}.result`}
                  control={control}
                  render={({ field }) => (
             <Input 
                type="number" 
                      placeholder={getResultPlaceholder()}
                      step="0.01"
                      value={field.value || ''}
                      onChange={(e) => handleResultChange(e.target.value)}
                      onFocus={handleResultFocus}
                      onBlur={handleResultBlur}
                      onKeyPress={handleKeyPress}
                      className={getFieldError('result') ? 'border-red-500 text-gray-700 font-medium' : 'text-gray-700 font-medium'}
                      aria-label="Сумма получения"
                      aria-describedby={getFieldError('result') ? `result-error-${index}` : undefined}
                    />
                  )}
              />
          </div>
        </div>
      </div>
      
          {/* Кнопка удаления */}
      {isRemovable && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
          onClick={onRemove}
              aria-label="Удалить валютную пару"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
          )}
        </div>

        {/* Ошибки отображаются отдельной строкой */}
        <div className="mt-2 grid grid-cols-2 gap-2">
          <div className="flex gap-2">
            <div className="w-1/3">
              {getFieldError('fromCurrency') && (
                <p id={`from-currency-error-${index}`} className="text-red-500 text-xs">
                  {getFieldError('fromCurrency')}
                </p>
              )}
            </div>
            <div className="w-2/3">
              {getFieldError('amount') && (
                <p id={`amount-error-${index}`} className="text-red-500 text-xs">
                  {getFieldError('amount')}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-1/3">
              {getFieldError('toCurrency') && (
                <p id={`to-currency-error-${index}`} className="text-red-500 text-xs">
                  {getFieldError('toCurrency')}
                </p>
              )}
            </div>
            <div className="w-2/3">
              {getFieldError('result') && (
                <p id={`result-error-${index}`} className="text-red-500 text-xs">
                  {getFieldError('result')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Информация о курсе */}
      {fromCurrencyCode && toCurrencyCode && (
        <div className="mt-2 px-4">
          {displayRate ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>
                1 {fromCurrencyCode} = {displayRate.rate.toLocaleString()} {toCurrencyCode}
              </span>
              {isHotRate && (
                <Badge 
                  variant="secondary" 
                  className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Горячий курс
                </Badge>
              )}
            </div>
          ) : !isDirectionAvailable ? (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              Направление недоступно
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 