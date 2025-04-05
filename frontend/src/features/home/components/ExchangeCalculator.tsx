import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Currency } from '@/types';
import { mockCurrencies, calculateToAmount, calculateFromAmount, mockExchangeRates } from '@/mocks/exchange-data';

interface ExchangeCalculatorProps {
  onCreateOrder?: () => void;
  simplified?: boolean;
  currencies?: Currency[];
}

// Быстрые пары для обмена
const QUICK_PAIRS = [
  { from: 'USDT', to: 'ARS', name: 'USDT → ARS' },
  { from: 'USDT', to: 'USD', name: 'USDT → USD cash' },
];

export const ExchangeCalculator = ({
  onCreateOrder,
  simplified = false,
  currencies = mockCurrencies,
}: ExchangeCalculatorProps) => {
  const navigate = useNavigate();
  const [fromCurrency, setFromCurrency] = useState<string>('USDT');
  const [toCurrency, setToCurrency] = useState<string>('ARS');
  const [fromAmount, setFromAmount] = useState<number>(100);
  const [toAmount, setToAmount] = useState<number>(() => {
    const calculated = calculateToAmount('USDT', 'ARS', 100);
    return calculated !== null ? calculated : 0;
  });

  // Обработчик выбора быстрой пары
  const handleQuickPairSelect = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  // Расчет суммы получения при изменении суммы отправления
  useEffect(() => {
    if (fromCurrency && toCurrency && fromAmount > 0) {
      const calculated = calculateToAmount(fromCurrency, toCurrency, fromAmount);
      if (calculated !== null) {
        setToAmount(calculated);
      }
    }
  }, [fromCurrency, toCurrency, fromAmount]);

  // Расчет суммы отправления при изменении суммы получения
  const handleToAmountChange = (value: number) => {
    setToAmount(value);
    if (fromCurrency && toCurrency && value > 0) {
      const calculated = calculateFromAmount(fromCurrency, toCurrency, value);
      if (calculated !== null) {
        setFromAmount(calculated);
      }
    }
  };

  // Переход к оформлению заказа
  const handleCreateOrder = () => {
    if (onCreateOrder) {
      onCreateOrder();
    } else {
      if (fromCurrency && toCurrency && fromAmount > 0) {
        // Сохраняем больше данных для следующего экрана
        const currentRate = mockExchangeRates
          .filter(rate => 
            rate.fromCurrency === fromCurrency && 
            rate.toCurrency === toCurrency &&
            fromAmount >= rate.minAmount &&
            (!rate.maxAmount || fromAmount <= rate.maxAmount)
          )[0];

        localStorage.setItem('exchangeCalculatorData', JSON.stringify({
          fromCurrency,
          toCurrency,
          fromAmount,
          toAmount,
          rate: currentRate?.rate || (toAmount / fromAmount),
          timestamp: new Date().toISOString(),
        }));
        navigate('/exchange');
      }
    }
  };

  return (
    <div className="exchange-calculator bg-white rounded-xl shadow-lg p-6">
      {!simplified && (
        <>
          <h3 className="text-2xl font-bold mb-6">Калькулятор обмена</h3>
          <div className="flex flex-wrap gap-3 mb-8">
            {QUICK_PAIRS.map((pair, index) => (
              <button
                key={index}
                onClick={() => handleQuickPairSelect(pair.from, pair.to)}
                className={`px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                  ${fromCurrency === pair.from && toCurrency === pair.to
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow'
                  }`}
              >
                {pair.name}
              </button>
            ))}
          </div>
        </>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="exchange-calculator-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Вы отдаете
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="select-currency flex-shrink-0 w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Валюта</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={fromAmount || ''}
              onChange={(e) => setFromAmount(Number(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="exchange-calculator-group">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Вы получаете
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="select-currency flex-shrink-0 w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Валюта</option>
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={toAmount || ''}
              onChange={(e) => handleToAmountChange(Number(e.target.value))}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {fromCurrency && toCurrency && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="space-y-3">
            {mockExchangeRates
              .filter(rate => 
                rate.fromCurrency === fromCurrency && 
                rate.toCurrency === toCurrency
              )
              .sort((a, b) => a.minAmount - b.minAmount)
              .map((rate, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {rate.maxAmount 
                      ? `До ${rate.maxAmount} ${fromCurrency}`
                      : `От ${rate.minAmount} ${fromCurrency}`
                    }:
                  </span>
                  <span className={`font-medium ${
                    fromAmount >= rate.minAmount && (!rate.maxAmount || fromAmount <= rate.maxAmount)
                      ? 'text-green-600'
                      : 'text-gray-700'
                  }`}>
                    1 {fromCurrency} = {rate.rate} {toCurrency}
                  </span>
                </div>
              ))
            }
          </div>
          {fromAmount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ваш курс:</span>
                <span className="font-semibold text-green-600 text-lg">
                  1 {fromCurrency} = {(toAmount / fromAmount).toFixed(2)} {toCurrency}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!simplified && (
        <div className="flex justify-end mt-8">
          <Button 
            variant="primary"
            onClick={handleCreateOrder}
            disabled={!fromCurrency || !toCurrency || fromAmount <= 0}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Заказать обмен
          </Button>
        </div>
      )}
    </div>
  );
};