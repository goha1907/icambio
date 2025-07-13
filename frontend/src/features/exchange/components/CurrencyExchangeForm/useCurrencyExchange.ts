import { useEffect, useMemo, useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { 
  MOCK_CURRENCIES_DB, 
  getExchangeRatesForPair 
} from '@/shared/lib/mock-data-db';

interface UseCurrencyExchangeProps {
  index: number;
}

export const useCurrencyExchange = ({ index }: UseCurrencyExchangeProps) => {
  const { control, setValue, watch, setError, clearErrors } = useFormContext();
  const [activeField, setActiveField] = useState<'from' | 'to' | null>(null);

  const pair = useWatch({
    control,
    name: `pairs.${index}`,
  });
  
  const { fromCurrency: fromCurrencyCode, toCurrency: toCurrencyCode, amount, result } = pair;

  // Получаем объекты валют
  const fromCurrency = useMemo(() => 
    MOCK_CURRENCIES_DB.find(c => c.code === fromCurrencyCode),
    [fromCurrencyCode]
  );
  
  const toCurrency = useMemo(() => 
    MOCK_CURRENCIES_DB.find(c => c.code === toCurrencyCode),
    [toCurrencyCode]
  );

  // Находим подходящий курс для отображения
  const getExchangeRateForAmount = (currentAmount: number) => {
    if (!fromCurrencyCode || !toCurrencyCode || !fromCurrency || !toCurrency) return null;

    const availableRates = getExchangeRatesForPair(fromCurrency.id, toCurrency.id);

    if (availableRates.length === 0) return null;

    if (!currentAmount || currentAmount <= 0) {
      return availableRates.sort((a, b) => a.min_amount - b.min_amount)[0];
    }

    const suitableRates = availableRates.filter(
      rate => currentAmount >= rate.min_amount && (!rate.max_amount || currentAmount <= rate.max_amount)
    );

    if (suitableRates.length > 0) {
      return suitableRates.sort((a, b) => b.rate - a.rate)[0];
    }

    if (currentAmount < availableRates[0].min_amount) {
      return availableRates.sort((a, b) => a.min_amount - b.min_amount)[0];
    } else {
      return availableRates.sort((a, b) => (b.max_amount || 0) - (a.max_amount || 0))[0];
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
    if (!fromCurrencyCode || !toCurrencyCode || !fromCurrency || !toCurrency) return true;
    
    return getExchangeRatesForPair(fromCurrency.id, toCurrency.id).length > 0;
  }, [fromCurrencyCode, toCurrencyCode, fromCurrency, toCurrency]);

  // Получаем информацию о лимитах для отображения в placeholder
  const limitsInfo = useMemo(() => {
    if (!fromCurrencyCode || !toCurrencyCode || !fromCurrency || !toCurrency) return null;
    
    const rates = getExchangeRatesForPair(fromCurrency.id, toCurrency.id);
    
    if (rates.length === 0) return null;
    
    const minAmount = Math.min(...rates.map(r => r.min_amount));
    const maxAmount = Math.max(...rates.map(r => r.max_amount || Infinity));
    
    return { 
      minAmount, 
      maxAmount: maxAmount === Infinity ? undefined : maxAmount,
      symbol: fromCurrency?.symbol || ''
    };
  }, [fromCurrencyCode, toCurrencyCode, fromCurrency, toCurrency]);

  // Получаем информацию о лимитах для обратного направления
  const reverseLimitsInfo = useMemo(() => {
    if (!fromCurrencyCode || !toCurrencyCode || !fromCurrency || !toCurrency) return null;
    
    const rates = getExchangeRatesForPair(toCurrency.id, fromCurrency.id);
    
    if (rates.length === 0) return null;
    
    const minAmount = Math.min(...rates.map(r => r.min_amount));
    const maxAmount = Math.max(...rates.map(r => r.max_amount || Infinity));
    
    return { 
      minAmount, 
      maxAmount: maxAmount === Infinity ? undefined : maxAmount,
      symbol: toCurrency?.symbol || ''
    };
  }, [fromCurrencyCode, toCurrencyCode, fromCurrency, toCurrency]);

  // Функция округления по decimal_places валюты
  const formatCurrencyAmount = (amount: number, currency: any) => {
    const decimals = currency.decimal_places || 2;
    return parseFloat(amount.toFixed(decimals));
  };

  // Валидация ввода
  const validateAmount = (value: number, isFromField: boolean) => {
    const fieldName = isFromField ? 'amount' : 'result';
    const limits = isFromField ? limitsInfo : reverseLimitsInfo;
    
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

  // Расчет результата
  useEffect(() => {
    if (!fromCurrencyCode || !toCurrencyCode || !exchangeRateData || activeField === null) return;
    
    const timeoutId = setTimeout(() => {
      if (activeField === 'from' && amount !== undefined && amount !== null && amount !== 0) {
        const calculatedResult = amount * exchangeRateData.rate;
        const formattedResult = formatCurrencyAmount(calculatedResult, toCurrency!);
        setValue(`pairs.${index}.result`, formattedResult, { shouldValidate: true });
      } else if (activeField === 'to' && result !== undefined && result !== null && result !== 0) {
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
  };

  const handleResultFocus = () => {
    setActiveField('to');
  };

  const handleAmountBlur = () => {
    if (amount !== undefined && amount !== null) {
      validateAmount(amount, true);
    }
  };

  const handleResultBlur = () => {
    if (result !== undefined && result !== null) {
      validateAmount(result, false);
    }
  };

  const getFieldError = (fieldName: string) => {
    const error = watch(`pairs.${index}.${fieldName}`);
    return error?.message;
  };

  const getAmountPlaceholder = () => {
    if (!limitsInfo) return 'Введите сумму';
    const { minAmount, maxAmount, symbol } = limitsInfo;
    if (maxAmount) {
      return `${symbol}${minAmount.toLocaleString()} - ${symbol}${maxAmount.toLocaleString()}`;
    }
    return `От ${symbol}${minAmount.toLocaleString()}`;
  };

  const getResultPlaceholder = () => {
    if (!reverseLimitsInfo) return 'Введите сумму';
    const { minAmount, maxAmount, symbol } = reverseLimitsInfo;
    if (maxAmount) {
      return `${symbol}${minAmount.toLocaleString()} - ${symbol}${maxAmount.toLocaleString()}`;
    }
    return `От ${symbol}${minAmount.toLocaleString()}`;
  };

  return {
    fromCurrency,
    toCurrency,
    exchangeRateData,
    isDirectionAvailable,
    handleSwap,
    handleAmountChange,
    handleResultChange,
    handleAmountFocus,
    handleResultFocus,
    handleAmountBlur,
    handleResultBlur,
    getFieldError,
    getAmountPlaceholder,
    getResultPlaceholder,
  };
}; 