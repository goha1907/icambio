import { useState, useEffect } from 'react';
import { 
  getExchangeRate,
  calculateToAmount,
  calculateFromAmount
} from '@/mocks/exchange-data';

interface UseExchangeRateProps {
  fromCurrency: string;
  toCurrency: string;
  initialFromAmount?: number;
  initialToAmount?: number;
}

export const useExchangeRate = ({
  fromCurrency,
  toCurrency,
  initialFromAmount = 0,
  initialToAmount = 0
}: UseExchangeRateProps) => {
  const [fromAmount, setFromAmount] = useState(initialFromAmount);
  const [toAmount, setToAmount] = useState(initialToAmount);
  const [rate, setRate] = useState<number | null>(null);

  // Обновление курса при изменении валют
  useEffect(() => {
    if (fromCurrency && toCurrency) {
      const currentRate = getExchangeRate(fromCurrency, toCurrency);
      setRate(currentRate);

      // Если есть сумма отправления, пересчитываем сумму получения
      if (fromAmount > 0 && currentRate !== null) {
        const calculated = calculateToAmount(fromCurrency, toCurrency, fromAmount);
        if (calculated !== null) {
          setToAmount(calculated);
        }
      }
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  // Обработчик изменения суммы отправления
  const handleFromAmountChange = (value: number) => {
    setFromAmount(value);
    if (fromCurrency && toCurrency && value > 0 && rate !== null) {
      const calculated = calculateToAmount(fromCurrency, toCurrency, value);
      if (calculated !== null) {
        setToAmount(calculated);
      }
    }
  };

  // Обработчик изменения суммы получения
  const handleToAmountChange = (value: number) => {
    setToAmount(value);
    if (fromCurrency && toCurrency && value > 0 && rate !== null) {
      const calculated = calculateFromAmount(fromCurrency, toCurrency, value);
      if (calculated !== null) {
        setFromAmount(calculated);
      }
    }
  };

  return {
    fromAmount,
    toAmount,
    rate,
    handleFromAmountChange,
    handleToAmountChange
  };
};