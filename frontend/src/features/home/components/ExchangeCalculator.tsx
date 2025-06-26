import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/shared/ui/Button';
import { CurrencyPairForm } from '@/features/exchange/components/CurrencyPairForm';

const calculatorSchema = z.object({
  pairs: z.array(
    z.object({
      fromCurrency: z.string(),
      toCurrency: z.string(),
      amount: z.number().optional(),
      result: z.number().optional(),
    })
  ).min(1),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

interface ExchangeCalculatorProps {
  simplified?: boolean;
}

// Быстрые пары для обмена
const QUICK_PAIRS = [
  { fromCurrency: 'USDT', toCurrency: 'ARS', name: 'USDT → ARS' },
  { fromCurrency: 'USDT', toCurrency: 'USD', name: 'USDT → USD cash' },
];

export const ExchangeCalculator = ({
  simplified = false,
}: ExchangeCalculatorProps) => {
  const navigate = useNavigate();
  const [activePairIndex, setActivePairIndex] = useState(0);
  
  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      pairs: [QUICK_PAIRS[0]],
    },
  });
  
  const { watch, setValue, handleSubmit, formState } = form;
  const pairs = watch("pairs");
  const currentPair = pairs?.[0] || {};

  useEffect(() => {
    const selectedPair = QUICK_PAIRS[activePairIndex];
    setValue("pairs.0.fromCurrency", selectedPair.fromCurrency);
    setValue("pairs.0.toCurrency", selectedPair.toCurrency);
    setValue("pairs.0.amount", undefined);
    setValue("pairs.0.result", undefined);
  }, [activePairIndex, setValue]);

  const handleCreateOrder = (data: CalculatorFormData) => {
    const orderData = data.pairs[0];
    if (orderData.fromCurrency && orderData.toCurrency && (orderData.amount || 0) > 0) {
      localStorage.setItem('exchangeCalculatorData', JSON.stringify({
        ...orderData,
        timestamp: new Date().toISOString(),
      }));
      navigate('/exchange');
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
                variant={activePairIndex === index ? "primary" : "secondary"}
                onClick={() => setActivePairIndex(index)}
              >
                {pair.name}
              </Button>
            ))}
          </div>
        </>
      )}
      
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(handleCreateOrder)}>
          <CurrencyPairForm
            index={0}
            isRemovable={false}
            onRemove={() => {}}
          />

          {!simplified && (
            <div className="flex justify-end mt-8">
              <Button 
                type="submit"
                disabled={!currentPair.amount || currentPair.amount <= 0 || !formState.isValid}
                className="w-full sm:w-auto"
              >
                Заказать обмен
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};