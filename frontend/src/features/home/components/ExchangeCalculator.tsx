import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { useCurrencies, useExchangeCalculator } from '@/features/exchange/hooks/useExchangeRate';

interface ExchangeCalculatorProps {
  onCreateOrder?: () => void;
  simplified?: boolean;
}

// Быстрые пары для обмена
const QUICK_PAIRS = [
  { from: 'USDT', to: 'ARS', name: 'USDT → ARS' },
  { from: 'USDT', to: 'USD', name: 'USDT → USD cash' },
];

export const ExchangeCalculator = ({
  onCreateOrder,
  simplified = false,
}: ExchangeCalculatorProps) => {
  const navigate = useNavigate();
  const { data: currencies, isLoading: isLoadingCurrencies } = useCurrencies();
  const [fromCurrencyCode, setFromCurrencyCode] = useState<string>('USDT');
  const [toCurrencyCode, setToCurrencyCode] = useState<string>('ARS');

  const {
    fromAmount,
    toAmount,
    currentRate,
    handleFromAmountChange,
    handleToAmountChange,
    isLoading: isLoadingCalculation,
  } = useExchangeCalculator({
    fromCurrency: fromCurrencyCode,
    toCurrency: toCurrencyCode,
    initialFromAmount: 100,
  });

  // Обработчик выбора быстрой пары
  const handleQuickPairSelect = (from: string, to: string) => {
    setFromCurrencyCode(from);
    setToCurrencyCode(to);
  };

  // Переход к оформлению заказа
  const handleCreateOrder = () => {
    if (onCreateOrder) {
      onCreateOrder();
    } else {
      if (fromCurrencyCode && toCurrencyCode && fromAmount > 0 && currentRate) {
        localStorage.setItem('exchangeCalculatorData', JSON.stringify({
          fromCurrency: fromCurrencyCode,
          toCurrency: toCurrencyCode,
          fromAmount,
          toAmount,
          rate: currentRate.rate,
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
                  ${fromCurrencyCode === pair.from && toCurrencyCode === pair.to
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
              value={fromCurrencyCode}
              onChange={(e) => setFromCurrencyCode(e.target.value)}
              className="select-currency flex-shrink-0 w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Валюта</option>
              {isLoadingCurrencies && <option>Загрузка...</option>}
              {currencies?.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} ({currency.symbol})
                </option>
              ))}
            </select>
            <Input
              type="number"
              value={fromAmount || ''}
              onChange={(e) => handleFromAmountChange(Number(e.target.value))}
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
              value={toCurrencyCode}
              onChange={(e) => setToCurrencyCode(e.target.value)}
              className="select-currency flex-shrink-0 w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Валюта</option>
              {isLoadingCurrencies && <option>Загрузка...</option>}
              {currencies?.map((currency) => (
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

      {fromCurrencyCode && toCurrencyCode && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <div className="space-y-3">
            {currentRate && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {currentRate.maxAmount
                    ? `До ${currentRate.maxAmount} ${currentRate.from_currency.code}`
                    : `От ${currentRate.minAmount} ${currentRate.from_currency.code}`
                  }:
                </span>
                <span className={`font-medium ${
                  fromAmount >= currentRate.minAmount && (!currentRate.maxAmount || fromAmount <= currentRate.maxAmount)
                    ? 'text-green-600'
                    : 'text-gray-700'
                }`}>
                  1 {currentRate.from_currency.code} = {currentRate.rate} {currentRate.to_currency.code}
                </span>
              </div>
            )}
            {isLoadingCalculation && <p>Расчет...</p>}
            {!currentRate && !isLoadingCurrencies && !isLoadingCalculation && (
              <p className="text-sm text-red-500">Нет доступных курсов для выбранной пары.</p>
            )}
          </div>
          {fromAmount > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Ваш курс:</span>
                <span className="font-semibold text-green-600 text-lg">
                  1 {fromCurrencyCode} = {(toAmount / fromAmount).toFixed(2)} {toCurrencyCode}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {!simplified && (
        <div className="flex justify-end mt-8">
          <Button 
            variant="default"
            onClick={handleCreateOrder}
            disabled={!fromCurrencyCode || !toCurrencyCode || fromAmount <= 0}
            className="w-full sm:w-auto px-8 py-3 text-lg font-semibold rounded-lg transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Заказать обмен
          </Button>
        </div>
      )}
    </div>
  );
};