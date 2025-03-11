import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Currency } from '@/types';
import { mockCurrencies, calculateToAmount, calculateFromAmount } from '@/mocks/exchange-data';

interface ExchangeCalculatorProps {
  onCreateOrder?: () => void;
  simplified?: boolean;
  currencies?: Currency[];
}

export const ExchangeCalculator = ({
  onCreateOrder,
  simplified = false,
  currencies = mockCurrencies,
}: ExchangeCalculatorProps) => {
  const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);

  // Мемоизация опций валют
  const currencyOptions = useMemo(() => {
    return currencies.map((currency) => (
      <option key={currency.code} value={currency.code}>
        {currency.code} ({currency.symbol})
      </option>
    ));
  }, [currencies]);

  // Мемоизация обработчиков изменения валют
  const handleFromCurrencyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  }, []);

  const handleToCurrencyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  }, []);

  // Мемоизация обработчиков изменения сумм
  const handleFromAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setFromAmount(value);
  }, []);

  const handleToAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setToAmount(value);
    
    if (fromCurrency && toCurrency && value > 0) {
      const calculated = calculateFromAmount(fromCurrency, toCurrency, value);
      if (calculated !== null) {
        setFromAmount(calculated);
      }
    }
  }, [fromCurrency, toCurrency]);

  // Расчет суммы получения при изменении суммы отправления или валют
  useEffect(() => {
    if (fromCurrency && toCurrency && fromAmount > 0) {
      const calculated = calculateToAmount(fromCurrency, toCurrency, fromAmount);
      if (calculated !== null) {
        setToAmount(calculated);
      }
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  // Мемоизация отображения курса
  const exchangeRateInfo = useMemo(() => {
    if (fromCurrency && toCurrency && fromAmount > 0 && toAmount > 0) {
      const rate = (toAmount / fromAmount).toFixed(6);
      return (
        <div className="exchange-rate-info text-sm text-gray-600 mb-4">
          Курс: 1 {fromCurrency} = {rate} {toCurrency}
        </div>
      );
    }
    return null;
  }, [fromCurrency, toCurrency, fromAmount, toAmount]);

  // Мемоизация обработчика создания заказа
  const handleCreateOrder = useCallback(() => {
    if (onCreateOrder) {
      onCreateOrder();
    } else {
      if (fromCurrency && toCurrency && fromAmount > 0) {
        localStorage.setItem('exchangeCalculatorData', JSON.stringify({
          fromCurrency,
          toCurrency,
          fromAmount,
          toAmount
        }));
      }
      navigate('/exchange');
    }
  }, [onCreateOrder, navigate, fromCurrency, toCurrency, fromAmount, toAmount]);

  return (
    <div className="exchange-calculator">
      {!simplified && <h3 className="text-xl font-semibold mb-4">Калькулятор обмена</h3>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Вы отдаете</label>
          <div className="flex">
            <select
              value={fromCurrency}
              onChange={handleFromCurrencyChange}
              className="form-input rounded-r-none w-1/3 border-r-0"
            >
              <option value="">Выберите...</option>
              {currencyOptions}
            </select>
            <Input
              type="number"
              value={fromAmount || ''}
              onChange={handleFromAmountChange}
              className="rounded-l-none w-2/3"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Вы получаете</label>
          <div className="flex">
            <select
              value={toCurrency}
              onChange={handleToCurrencyChange}
              className="form-input rounded-r-none w-1/3 border-r-0"
            >
              <option value="">Выберите...</option>
              {currencyOptions}
            </select>
            <Input
              type="number"
              value={toAmount || ''}
              onChange={handleToAmountChange}
              className="rounded-l-none w-2/3"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>
      </div>

      {exchangeRateInfo}

      {!simplified && (
        <div className="flex justify-end">
          <Button 
            variant="primary" 
            onClick={handleCreateOrder}
            disabled={!fromCurrency || !toCurrency || fromAmount <= 0}
          >
            Заказать обмен
          </Button>
        </div>
      )}
    </div>
  );
};