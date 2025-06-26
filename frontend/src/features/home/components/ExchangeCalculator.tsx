import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';
import { CurrencyPairForm } from '@/features/exchange/components/CurrencyPairForm';

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
  const [activePair, setActivePair] = useState(QUICK_PAIRS[0]);
  const [exchangeData, setExchangeData] = useState({ fromAmount: 0, toAmount: 0, rate: 0 });

  const handleCreateOrder = () => {
    if (onCreateOrder) {
      onCreateOrder();
    } else {
      if (activePair.from && activePair.to && exchangeData.fromAmount > 0) {
        localStorage.setItem('exchangeCalculatorData', JSON.stringify({
          fromCurrency: activePair.from,
          toCurrency: activePair.to,
          fromAmount: exchangeData.fromAmount,
          toAmount: exchangeData.toAmount,
          rate: exchangeData.rate,
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
              <Button
                key={index}
                variant={activePair.name === pair.name ? "primary" : "secondary"}
                onClick={() => setActivePair(pair)}
              >
                {pair.name}
              </Button>
            ))}
          </div>
        </>
      )}

      <CurrencyPairForm
        key={activePair.name} // rerender on pair change
        initialFromCurrency={activePair.from}
        initialToCurrency={activePair.to}
        onRateUpdate={(data) => setExchangeData(data as any)}
      />

      {!simplified && (
        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleCreateOrder}
            disabled={!activePair.from || !activePair.to || !exchangeData.fromAmount || exchangeData.fromAmount <= 0}
            className="btn-primary w-full sm:w-auto"
          >
            Заказать обмен
          </Button>
        </div>
      )}
    </div>
  );
};