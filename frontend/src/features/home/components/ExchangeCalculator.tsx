import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import type { Currency } from '@/types';

interface ExchangeCalculatorProps {
  currencies: Currency[];
  rates?: Record<string, Record<string, number>>;
  onCreateOrder?: () => void;
  simplified?: boolean;
}

export const ExchangeCalculator = ({
  currencies,
  rates = {},
  onCreateOrder,
  simplified = false,
}: ExchangeCalculatorProps) => {
  const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState<string>('');
  const [toCurrency, setToCurrency] = useState<string>('');
  const [fromAmount, setFromAmount] = useState<number>(0);
  const [toAmount, setToAmount] = useState<number>(0);

  // Получение курса обмена между двумя валютами
  const getExchangeRate = (from: string, to: string): number => {
    // В реальном приложении это будет получено из API или prop rates
    // Временная заглушка с фиксированными курсами
    const mockRates: Record<string, Record<string, number>> = {
      USD: { EUR: 0.85, RUB: 75.5, BTC: 0.000026, ETH: 0.00041, USDT: 1 },
      EUR: { USD: 1.18, RUB: 89.2, BTC: 0.000031, ETH: 0.00048, USDT: 1.18 },
      RUB: { USD: 0.013, EUR: 0.011, BTC: 0.00000034, ETH: 0.0000054, USDT: 0.013 },
      BTC: { USD: 38500, EUR: 32700, RUB: 2900000, ETH: 15.6, USDT: 38500 },
      ETH: { USD: 2450, EUR: 2080, RUB: 184600, BTC: 0.064, USDT: 2450 },
      USDT: { USD: 1, EUR: 0.85, RUB: 75.5, BTC: 0.000026, ETH: 0.00041 },
    };

    const rateSource = Object.keys(rates).length > 0 ? rates : mockRates;

    if (from && to && from !== to) {
      return rateSource[from]?.[to] || 0;
    }
    return 0;
  };

  // Расчет суммы получения при изменении суммы отправления
  useEffect(() => {
    if (fromCurrency && toCurrency && fromAmount > 0) {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      if (rate > 0) {
        const calculated = fromAmount * rate;
        // Форматируем с учетом типа валюты
        const targetCurrency = currencies.find((c) => c.code === toCurrency);
        if (targetCurrency) {
          const decimals = targetCurrency.decimals || 2;
          setToAmount(parseFloat(calculated.toFixed(decimals)));
        } else {
          setToAmount(calculated);
        }
      }
    }
  }, [fromCurrency, toCurrency, fromAmount, currencies]);

  // Расчет суммы отправления при изменении суммы получения
  const handleToAmountChange = (value: number) => {
    setToAmount(value);
    if (fromCurrency && toCurrency && value > 0) {
      const rate = getExchangeRate(fromCurrency, toCurrency);
      if (rate > 0) {
        const calculated = value / rate;
        // Форматируем с учетом типа валюты
        const sourceCurrency = currencies.find((c) => c.code === fromCurrency);
        if (sourceCurrency) {
          const decimals = sourceCurrency.decimals || 2;
          setFromAmount(parseFloat(calculated.toFixed(decimals)));
        } else {
          setFromAmount(calculated);
        }
      }
    }
  };

  // Переход к оформлению заказа
  const handleCreateOrder = () => {
    if (onCreateOrder) {
      onCreateOrder();
    } else {
      navigate('/exchange');
    }
  };

  return (
    <div className="exchange-calculator">
      {!simplified && <h3 className="text-xl font-semibold mb-4">Калькулятор обмена</h3>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Вы отдаете</label>
          <div className="flex">
            <Input
              type="number"
              value={fromAmount || ''}
              onChange={(e) => setFromAmount(Number(e.target.value))}
              className="rounded-r-none w-2/3"
              placeholder="0.00"
              min="0"
            />
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="form-input rounded-l-none w-1/3 border-l-0"
            >
              <option value="">Выберите...</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Вы получаете</label>
          <div className="flex">
            <Input
              type="number"
              value={toAmount || ''}
              onChange={(e) => handleToAmountChange(Number(e.target.value))}
              className="rounded-r-none w-2/3"
              placeholder="0.00"
              min="0"
            />
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="form-input rounded-l-none w-1/3 border-l-0"
            >
              <option value="">Выберите...</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {fromCurrency && toCurrency && fromAmount > 0 && (
        <div className="exchange-rate-info text-sm text-gray-600 mb-4">
          Курс: 1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(6)}{' '}
          {toCurrency}
        </div>
      )}

      {!simplified && (
        <div className="flex justify-end">
          <Button variant="primary" onClick={handleCreateOrder}>
            Заказать обмен
          </Button>
        </div>
      )}
    </div>
  );
};
