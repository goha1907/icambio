import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { currencyService } from '../services/currencyService';
import { exchangeRateService } from '../services/exchangeRateService';
import { ExchangeRate } from '@/types';

export const useCurrencies = () => {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: currencyService.getAllCurrencies,
  });
};

export const useExchangeRates = () => {
  return useQuery({
    queryKey: ['exchangeRates'],
    queryFn: exchangeRateService.getAllExchangeRates,
  });
};

interface UseExchangeCalculatorProps {
  fromCurrency: string;
  toCurrency: string;
  initialFromAmount?: number;
  initialToAmount?: number;
}

export const useExchangeCalculator = ({
  fromCurrency,
  toCurrency,
  initialFromAmount = 0,
  initialToAmount = 0,
}: UseExchangeCalculatorProps) => {
  const queryClient = useQueryClient();
  const { data: rates, isLoading: isLoadingRates } = useExchangeRates();

  const [fromAmount, setFromAmount] = useState(initialFromAmount);
  const [toAmount, setToAmount] = useState(initialToAmount);
  const [currentRate, setCurrentRate] = useState<ExchangeRate | null>(null);

  useEffect(() => {
    if (rates && fromCurrency && toCurrency) {
      const rate = rates.find(
        (r) => r.from_currency.code === fromCurrency && r.to_currency.code === toCurrency
      );
      setCurrentRate(rate || null);
    }
  }, [rates, fromCurrency, toCurrency]);

  const { mutateAsync: calculateMutation, isPending: isCalculating } = useMutation({
    mutationFn: ({ rateId, data }: { rateId: string; data: { amount_from?: number; amount_to?: number } }) =>
      exchangeRateService.calculateExchange(rateId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['exchangeRates'] });
      setFromAmount(data.amount_from);
      setToAmount(data.amount_to);
    },
    onError: (error) => {
      console.error('Calculation error:', error);
    },
  });

  const triggerCalculation = async (type: 'from' | 'to', amount: number) => {
    if (!currentRate) return;
    const rateId = currentRate.id.toString();
    const data = type === 'from' ? { amount_from: amount } : { amount_to: amount };
    await calculateMutation({ rateId, data });
  };

  useEffect(() => {
    if (currentRate && initialFromAmount > 0) {
      triggerCalculation('from', initialFromAmount);
    }
  }, [currentRate, initialFromAmount]);

  const handleFromAmountChange = async (value: number) => {
    setFromAmount(value);
    if (currentRate && value > 0) {
      await triggerCalculation('from', value);
    }
  };

  const handleToAmountChange = async (value: number) => {
    setToAmount(value);
    if (currentRate && value > 0) {
      await triggerCalculation('to', value);
    }
  };

  return {
    fromAmount,
    toAmount,
    currentRate,
    handleFromAmountChange,
    handleToAmountChange,
    isLoading: isLoadingRates || isCalculating,
  };
};