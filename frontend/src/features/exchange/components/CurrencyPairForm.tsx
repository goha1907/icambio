import { useState, useEffect, useMemo } from 'react';
import { MOCK_CURRENCIES, MOCK_EXCHANGE_RATES } from '@/lib/mock-data';
import { ArrowRightLeft, Trash2 } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Dropdown } from '@/shared/ui/Dropdown';

interface CurrencyPairFormProps {
  initialFromCurrency?: string;
  initialToCurrency?: string;
  onRateUpdate: (data: { fromAmount: number; toAmount: number; rate: number }) => void;
  onRemove?: () => void;
  isRemovable?: boolean;
}

export const CurrencyPairForm = ({
  initialFromCurrency = 'USDT',
  initialToCurrency = 'ARS',
  onRateUpdate,
  onRemove,
  isRemovable = false,
}: CurrencyPairFormProps) => {
  const [fromCurrencyCode, setFromCurrencyCode] = useState(initialFromCurrency);
  const [toCurrencyCode, setToCurrencyCode] = useState(initialToCurrency);
  const [fromAmount, setFromAmount] = useState<string | number>('');
  const [toAmount, setToAmount] = useState<string | number>('');

  const exchangeRate = useMemo(() => {
    return MOCK_EXCHANGE_RATES.find(
      (rate) =>
        (rate.from_currency.code === fromCurrencyCode &&
          rate.to_currency.code === toCurrencyCode) ||
        (rate.from_currency.code === toCurrencyCode &&
          rate.to_currency.code === fromCurrencyCode)
    );
  }, [fromCurrencyCode, toCurrencyCode]);

  const rate = useMemo(() => {
    if (!exchangeRate) return 0;
    if (exchangeRate.from_currency.code === fromCurrencyCode) {
      return exchangeRate.rate;
    }
    return 1 / exchangeRate.rate;
  }, [exchangeRate, fromCurrencyCode]);

  const currencyOptions = useMemo(() => MOCK_CURRENCIES.map(currency => ({
    value: currency.code,
    label: currency.code,
  })), []);

  useEffect(() => {
    onRateUpdate({
      fromAmount: Number(fromAmount),
      toAmount: Number(toAmount),
      rate,
    });
  }, [fromAmount, toAmount, rate, onRateUpdate]);


  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFromAmount(value);
    if (rate) {
      const newToAmount = parseFloat(value) * rate;
      setToAmount(newToAmount > 0 ? newToAmount.toFixed(2) : '');
    } else {
      setToAmount('');
    }
  };

  const handleToAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setToAmount(value);
    if (rate) {
      const newFromAmount = parseFloat(value) / rate;
      setFromAmount(newFromAmount > 0 ? newFromAmount.toFixed(2) : '');
    } else {
      setFromAmount('');
    }
  };
  
  const handleSwapCurrencies = () => {
    const tempFromCode = fromCurrencyCode;
    setFromCurrencyCode(toCurrencyCode);
    setToCurrencyCode(tempFromCode);

    const tempFromAmount = fromAmount;
    setFromAmount(toAmount);
    setToAmount(tempFromAmount);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
      <div className="flex-grow flex items-center gap-2 w-full">
        <div className="w-32 flex-shrink-0">
          <Dropdown
            value={fromCurrencyCode}
            onChange={(value) => setFromCurrencyCode(value)}
            options={currencyOptions}
            className="!bg-gray-100 border-transparent focus:!ring-icmop-primary"
          />
        </div>
        <Input
          type="number"
          placeholder="0.00"
          className="flex-grow"
          value={fromAmount}
          onChange={handleFromAmountChange}
        />
      </div>

      <button onClick={handleSwapCurrencies} className="p-2 text-gray-500 hover:text-icmop-primary">
        <ArrowRightLeft size={20} />
      </button>

      <div className="flex-grow flex items-center gap-2 w-full">
        <div className="w-32 flex-shrink-0">
          <Dropdown
            value={toCurrencyCode}
            onChange={(value) => setToCurrencyCode(value)}
            options={currencyOptions}
            className="!bg-gray-100 border-transparent focus:!ring-icmop-primary"
          />
        </div>
        <Input
          type="number"
          placeholder="0.00"
          className="flex-grow"
          value={toAmount}
          onChange={handleToAmountChange}
        />
      </div>
      
      {isRemovable && (
        <button onClick={onRemove} className="p-2 text-gray-400 hover:text-red-500">
          <Trash2 size={20} />
        </button>
      )}
    </div>
  );
}; 