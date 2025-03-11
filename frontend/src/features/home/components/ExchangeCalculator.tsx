import { useState, useEffect } from 'react';
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
        // Сохраняем только в localStorage
        localStorage.setItem('exchangeCalculatorData', JSON.stringify({
          fromCurrency,
          toCurrency,
          fromAmount,
          toAmount
        }));
        
        // Простой переход без передачи state
        navigate('/exchange');
      } else {
        navigate('/exchange');
      }
    }
  };

  return (
    <div className="exchange-calculator">
      {!simplified && <h3 className="text-xl font-semibold mb-4">Калькулятор обмена</h3>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Вы отдаете</label>
          <div className="flex">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="form-input rounded-r-none w-1/3 border-r-0"
          >
            <option value="">Выберите...</option>
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
              onChange={(e) => setToCurrency(e.target.value)}
              className="form-input rounded-r-none w-1/3 border-r-0"
            >
              <option value="">Выберите...</option>
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
              className="rounded-l-none w-2/3"
              placeholder="0.00"
              min="0"
            />
          </div>
        </div>
      </div>

      {fromCurrency && toCurrency && fromAmount > 0 && (
        <div className="exchange-rate-info text-sm text-gray-600 mb-4">
          Курс: 1 {fromCurrency} = {(toAmount / fromAmount).toFixed(6)} {toCurrency}
        </div>
      )}

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