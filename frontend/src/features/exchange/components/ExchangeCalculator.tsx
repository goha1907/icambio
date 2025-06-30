import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/shared/ui/Button';
import { CurrencyPairForm } from '@/features/exchange/components/CurrencyPairForm';
import { MOCK_QUICK_PAIRS } from '@/lib/mock-data';

const calculatorSchema = z.object({
  pairs: z.array(
    z.object({
      fromCurrency: z.string(),
      toCurrency: z.string(),
      amount: z.number(),
      result: z.number(),
    })
  ).min(1),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

interface ExchangeCalculatorProps {
  simplified?: boolean;
}

// Фильтруем пары по visible флагу (определяется администратором)
const VISIBLE_QUICK_PAIRS = MOCK_QUICK_PAIRS.filter(pair => pair.visible);

export const ExchangeCalculator = ({
  simplified = false,
}: ExchangeCalculatorProps) => {
  const navigate = useNavigate();
  const [activePairIndex, setActivePairIndex] = useState(0);
  
  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      pairs: [VISIBLE_QUICK_PAIRS[0]],
    },
  });
  
  const { watch, setValue, handleSubmit, formState } = form;
  const pairs = watch("pairs");
  const currentPair = pairs?.[0] || {};

  useEffect(() => {
    const selectedPair = VISIBLE_QUICK_PAIRS[activePairIndex];
    setValue("pairs.0.fromCurrency", selectedPair.fromCurrency);
    setValue("pairs.0.toCurrency", selectedPair.toCurrency);
    setValue("pairs.0.amount", 0);
    setValue("pairs.0.result", 0);
  }, [activePairIndex, setValue]);

  // Проверяем валидность данных
  const isValidForOrder = () => {
    const pair = currentPair;
    if (!pair) return false;
    
    // Проверяем наличие валют
    if (!pair.fromCurrency || !pair.toCurrency) return false;
    
    // Проверяем, что есть хотя бы одна введенная сумма больше 0
    const hasValidAmount = (pair.amount && pair.amount > 0) || (pair.result && pair.result > 0);
    if (!hasValidAmount) return false;
    
    // Проверяем отсутствие ошибок формы
    const hasErrors = Object.keys(formState.errors).length > 0;
    if (hasErrors) return false;
    
    return true;
  };

  const handleCreateOrder = (data: CalculatorFormData) => {
    const orderData = data.pairs[0];
    if (isValidForOrder()) {
      localStorage.setItem('exchangeCalculatorData', JSON.stringify({
        ...orderData,
        timestamp: new Date().toISOString(),
      }));
      navigate('/exchange');
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-xl bg-white p-6 shadow-lg sm:p-8">
      {!simplified && (
        <>
          <h3 className="mb-6 bg-gradient-to-r from-icmop-primary to-icmop-dark bg-clip-text text-xl font-semibold text-transparent">
            Калькулятор обмена
          </h3>
          <div className="mb-8 flex flex-wrap gap-3">
            {VISIBLE_QUICK_PAIRS.map((pair, index) => (
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
                disabled={!isValidForOrder()}
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