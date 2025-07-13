import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { ArrowRightLeft, Flame } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/Select';
import { MOCK_CURRENCIES_DB } from '@/shared/lib/mock-data-db';
import { useCurrencyExchange } from './useCurrencyExchange';
import { CurrencyInput } from './CurrencyInput';
import { ExchangeRateBadge } from './ExchangeRateBadge';
import { Badge } from '@/shared/ui/Badge';

interface CurrencyExchangeFormProps {
  index: number;
}

export const CurrencyExchangeForm: React.FC<CurrencyExchangeFormProps> = ({ index }) => {
  const { control } = useFormContext();
  
  const {
    fromCurrency,
    toCurrency,
    exchangeRateData,
    isDirectionAvailable,
    handleSwap,
    handleAmountChange,
    handleResultChange,
    handleAmountFocus,
    handleResultFocus,
    handleAmountBlur,
    handleResultBlur,
    getFieldError,
    getAmountPlaceholder,
    getResultPlaceholder,
  } = useCurrencyExchange({ index });

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      {/* Desktop: flex-row, Mobile: flex-col */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
        {/* Блок "Отдаете" */}
        <div className="flex flex-col flex-1 min-w-[110px] sm:w-[20%]">
          <label className="text-sm font-medium text-muted-foreground mb-1">Отдаете</label>
          <Controller
            control={control}
            name={`pairs.${index}.fromCurrency`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Валюта" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CURRENCIES_DB.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-[120px] sm:w-[30%]">
          <span className="sr-only">Сумма отдачи</span>
          <Controller
            control={control}
            name={`pairs.${index}.amount`}
            render={({ field }) => (
              <CurrencyInput
                {...field}
                value={field.value || ''}
                onChange={(e) => handleAmountChange(e.target.value)}
                onFocus={handleAmountFocus}
                onBlur={handleAmountBlur}
                placeholder={getAmountPlaceholder()}
                type="number"
                step="any"
                className={getFieldError('amount') ? 'border-destructive' : ''}
              />
            )}
          />
        </div>
        {/* Кнопка реверса */}
        <div className="flex justify-center items-center py-2 sm:py-0">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="mx-1"
            aria-label="Поменять местами"
          >
            <ArrowRightLeft className="h-5 w-5" />
          </Button>
        </div>
        {/* Блок "Получаете" */}
        <div className="flex flex-col flex-1 min-w-[110px] sm:w-[20%]">
          <label className="text-sm font-medium text-muted-foreground mb-1">Получаете</label>
          <Controller
            control={control}
            name={`pairs.${index}.toCurrency`}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Валюта" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_CURRENCIES_DB.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.code}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="flex flex-col flex-1 min-w-[120px] sm:w-[30%]">
          <span className="sr-only">Сумма получения</span>
          <Controller
            control={control}
            name={`pairs.${index}.result`}
            render={({ field }) => (
              <CurrencyInput
                {...field}
                value={field.value || ''}
                onChange={(e) => handleResultChange(e.target.value)}
                onFocus={handleResultFocus}
                onBlur={handleResultBlur}
                placeholder={getResultPlaceholder()}
                type="number"
                step="any"
                className={getFieldError('result') ? 'border-destructive' : ''}
              />
            )}
          />
        </div>
      </div>
      {/* Ошибки */}
      <div className="flex gap-2 mt-1">
        {getFieldError('amount') && (
          <span className="text-xs text-destructive">{getFieldError('amount')}</span>
        )}
        {getFieldError('result') && (
          <span className="text-xs text-destructive">{getFieldError('result')}</span>
        )}
      </div>
      {/* Бэйджи */}
      <div className="flex flex-wrap items-center gap-2 mt-2 min-h-[32px]">
        <ExchangeRateBadge
          rate={exchangeRateData?.rate || null}
          isDirectionAvailable={isDirectionAvailable}
          fromCurrency={fromCurrency}
          toCurrency={toCurrency}
        />
        <Badge
          variant="destructive"
          className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full leading-none transition-opacity duration-200 ${exchangeRateData?.is_hot ? '' : 'opacity-0 pointer-events-none select-none'}`}
        >
          <Flame className="h-4 w-4 align-middle -mt-px" /> HOT
        </Badge>
      </div>
    </div>
  );
}; 