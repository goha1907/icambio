import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/shared/ui/Button';
import { CurrencyExchangeForm } from './CurrencyExchangeForm/CurrencyExchangeForm';
import { MOCK_EXCHANGE_RATES_DB, MOCK_CURRENCIES_DB } from '@/shared/lib/mock-data-db';

const calculatorSchema = z.object({
  pairs: z.array(
    z.object({
      fromCurrency: z.string(),
      toCurrency: z.string(),
      amount: z.number(),
      result: z.number()
    })
  ).min(1),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

// Получаем быстрые пары из курсов обмена (только те, что включены в фильтры)
const getQuickPairs = () => {
  const quickPairs = MOCK_EXCHANGE_RATES_DB
    .filter(rate => rate.visible && rate.in_filter)
    .map(rate => {
      const fromCurrency = MOCK_CURRENCIES_DB.find(c => c.id === rate.currency_from_id);
      const toCurrency = MOCK_CURRENCIES_DB.find(c => c.id === rate.currency_to_id);
      return {
        id: rate.id,
        fromCurrency: fromCurrency?.code || '',
        toCurrency: toCurrency?.code || '',
        is_hot: rate.is_hot
      };
    })
    .filter(pair => pair.fromCurrency && pair.toCurrency);
  
  // Убираем дубликаты
  const uniquePairs = quickPairs.filter((pair, index, self) => 
    index === self.findIndex(p => p.fromCurrency === pair.fromCurrency && p.toCurrency === pair.toCurrency)
  );
  
  return uniquePairs;
};

const VISIBLE_QUICK_PAIRS = getQuickPairs();

export const ExchangeCalculator = ({
  onOrderCreate,
  className = "",
}: {
  onOrderCreate?: (data: CalculatorFormData) => void;
  className?: string;
}) => {
  const form = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      pairs: VISIBLE_QUICK_PAIRS.length > 0 ? [{
        fromCurrency: VISIBLE_QUICK_PAIRS[0].fromCurrency,
        toCurrency: VISIBLE_QUICK_PAIRS[0].toCurrency,
        amount: 0,
        result: 0
      }] : []
    },
  });

  const { setValue } = form;

  const handleQuickPairSelect = (selectedPair: any) => {
    setValue("pairs.0.fromCurrency", selectedPair.fromCurrency);
    setValue("pairs.0.toCurrency", selectedPair.toCurrency);
  };

  const handleCreateOrder = (data: CalculatorFormData) => {
    if (onOrderCreate) {
      onOrderCreate(data);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-icambio-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">₮</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900">
          Калькулятор обмена
        </h3>
      </div>

      {/* Быстрые пары */}
      <div className="mb-8">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Популярные направления:
        </h4>
        <div className="flex flex-wrap gap-2">
          {VISIBLE_QUICK_PAIRS.map((pair: any, index: number) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickPairSelect(pair)}
              className={`text-xs ${
                pair.is_hot 
                  ? 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pair.fromCurrency} → {pair.toCurrency}
              {pair.is_hot && (
                <span className="ml-1 text-orange-500">🔥</span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Форма калькулятора */}
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(handleCreateOrder)}>
          <div className="space-y-4">
            <CurrencyExchangeForm index={0} />
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={!form.watch("pairs.0.amount") || form.watch("pairs.0.amount") <= 0}
            >
              Заказать обмен
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};