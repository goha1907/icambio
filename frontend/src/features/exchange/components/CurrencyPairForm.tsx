import { useEffect, useMemo } from 'react';
import { useWatch, useFormContext, Controller } from 'react-hook-form';
import { MOCK_CURRENCIES, MOCK_EXCHANGE_RATES } from '@/lib/mock-data';
import { ArrowRightLeft, Trash2 } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select';

interface CurrencyPairFormProps {
  index: number;
  isRemovable: boolean;
  onRemove: () => void;
}

export function CurrencyPairForm({ index, isRemovable, onRemove }: CurrencyPairFormProps) {
  const { control, setValue, watch } = useFormContext();

  const pair = useWatch({
    control,
    name: `pairs.${index}`,
  });
  
  const { fromCurrency: fromCurrencyCode, toCurrency: toCurrencyCode } = pair;

  const exchangeRateData = useMemo(() => {
    return MOCK_EXCHANGE_RATES.find(
      (rate) =>
        (rate.from_currency.code === fromCurrencyCode &&
          rate.to_currency.code === toCurrencyCode) ||
        (rate.from_currency.code === toCurrencyCode &&
          rate.to_currency.code === fromCurrencyCode)
    );
  }, [fromCurrencyCode, toCurrencyCode]);

  const rate = useMemo(() => {
    if (!exchangeRateData) return 0;
    if (exchangeRateData.from_currency.code === fromCurrencyCode) {
      return exchangeRateData.rate;
    }
    return 1 / exchangeRateData.rate;
  }, [exchangeRateData, fromCurrencyCode]);

  useEffect(() => {
    const amount = pair.amount;
    if (amount && rate) {
      const result = amount * rate;
      setValue(`pairs.${index}.result`, parseFloat(result.toFixed(2)), {
        shouldValidate: true,
      });
    }
  }, [pair.amount, rate, setValue, index]);

  const handleSwap = () => {
    const from = watch(`pairs.${index}.fromCurrency`);
    const to = watch(`pairs.${index}.toCurrency`);
    setValue(`pairs.${index}.fromCurrency`, to);
    setValue(`pairs.${index}.toCurrency`, from);
  };

  return (
    <div className="flex items-end gap-2 p-4 border rounded-lg bg-gray-50/50">
      <div className="flex-1">
        <label className="text-sm font-medium">Отдаете</label>
        <div className="flex gap-2 mt-1">
          <div className="w-2/3">
             <Controller
              name={`pairs.${index}.fromCurrency`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Валюта" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="w-1/3">
            <Controller
              name={`pairs.${index}.amount`}
              control={control}
              render={({ field }) => (
                <Input 
                  type="number" 
                  placeholder="Сумма" 
                  {...field} 
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              )}
            />
          </div>
        </div>
      </div>

      <Button type="button" variant="ghost" size="icon" onClick={handleSwap}>
        <ArrowRightLeft className="h-4 w-4" />
      </Button>

      <div className="flex-1">
        <label className="text-sm font-medium">Получаете</label>
        <div className="flex gap-2 mt-1">
           <div className="w-2/3">
            <Controller
              name={`pairs.${index}.toCurrency`}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Валюта" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_CURRENCIES.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name} ({c.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
           <div className="w-1/3">
             <Input 
                type="number" 
                placeholder="Результат" 
                disabled 
                value={'...'} // Placeholder for calculated result
              />
          </div>
        </div>
      </div>
      
      {isRemovable && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 