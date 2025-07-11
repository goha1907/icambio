import { useMemo, useState } from 'react';
import { ExchangeRate } from '@/features/exchange/types';
import { MOCK_EXCHANGE_RATES, CURRENCY_EMOJI_MAP } from '@/shared/lib/mock-data';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';

interface ExchangeRatesTableProps {
  className?: string;
}

interface FilterState {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
}

/**
 * Компонент таблицы курсов обмена
 * 
 * Отображает актуальные курсы обмена валют с возможностью фильтрации
 * по валютам отправления и получения, а также по сумме обмена.
 */
export const ExchangeRatesTable: React.FC<ExchangeRatesTableProps> = ({ className }) => {
  const rates = MOCK_EXCHANGE_RATES;
  
  const [filters, setFilters] = useState<FilterState>({
    fromCurrency: '',
    toCurrency: '',
    amount: '',
  });

  // Функция для получения эмодзи валюты
  const getCurrencyEmoji = (code: string): string => CURRENCY_EMOJI_MAP[code] || '💱';

  // Получение уникальных валют
  const currencies = useMemo(() => {
    const fromCurrencies = [...new Set(rates.map((rate: ExchangeRate) => rate.from_currency.code))];
    const toCurrencies = [...new Set(rates.map((rate: ExchangeRate) => rate.to_currency.code))];
    return {
      from: fromCurrencies.sort(),
      to: toCurrencies.sort(),
    };
  }, [rates]);

  // Группируем курсы по парам валют
  const groupedRates = useMemo(() => {
    const groups = rates.reduce((acc: Record<string, ExchangeRate[]>, rate: ExchangeRate) => {
      const key = `${rate.from_currency.code}-${rate.to_currency.code}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(rate);
      return acc;
    }, {} as Record<string, ExchangeRate[]>);

    return Object.values(groups);
  }, [rates]);

  // Фильтрация данных
  const filteredGroups = useMemo(() => {
    let processed = groupedRates.map(rateGroup => {
      return {
        id: rateGroup[0].id,
        fromCurrency: rateGroup[0].from_currency.code,
        toCurrency: rateGroup[0].to_currency.code,
        rates: rateGroup.sort((a, b) => a.minAmount - b.minAmount),
      };
    });

    // Фильтр по валюте отправления
    if (filters.fromCurrency) {
      processed = processed.filter(group => group.fromCurrency === filters.fromCurrency);
    }

    // Фильтр по валюте получения
    if (filters.toCurrency) {
      processed = processed.filter(group => group.toCurrency === filters.toCurrency);
    }

    // Фильтр по сумме (проверяем, попадает ли введенная сумма в лимиты)
    if (filters.amount) {
      const amount = parseFloat(filters.amount);
      if (!isNaN(amount)) {
        processed = processed
          .map(group => ({
            ...group,
            rates: group.rates.filter(rate => {
            const minAmount = rate.minAmount;
            const maxAmount = rate.maxAmount || Infinity;
            return amount >= minAmount && amount <= maxAmount;
            }),
          }))
          .filter(group => group.rates.length > 0);
      }
    }

    return processed;
  }, [groupedRates, filters]);

  // Обработчики изменения фильтров
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '__clear__' ? '' : value,
    }));
  };

  // Очистка всех фильтров
  const clearFilters = () => {
    setFilters({
      fromCurrency: '',
      toCurrency: '',
      amount: '',
    });
  };

  // Проверка наличия активных фильтров
  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {/* Заголовки */}
            <TableRow className="border-b-0">
              <TableHead className="w-[20%] text-center">Отдаете</TableHead>
              <TableHead className="w-[20%] text-center">Получаете</TableHead>
              <TableHead className="w-[30%] text-center">Лимиты</TableHead>
              <TableHead className="w-[30%] text-center">Курсы</TableHead>
            </TableRow>

            {/* Фильтры */}
            <TableRow className="border-b-0">
              <TableCell className="w-[20%]">
                <div className="relative">
                  <Select 
                    value={filters.fromCurrency}
                    onValueChange={(value) => handleFilterChange('fromCurrency', value)}
                  >
                    <SelectTrigger className="w-full font-normal pr-8">
                      <SelectValue placeholder="Выберите валюту" className="text-muted-foreground/60" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.from.map((currency: string) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filters.fromCurrency && (
                    <button
                      type="button"
                      onClick={() => handleFilterChange('fromCurrency', '')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-[20%]">
                <div className="relative">
                  <Select 
                    value={filters.toCurrency}
                    onValueChange={(value) => handleFilterChange('toCurrency', value)}
                  >
                    <SelectTrigger className="w-full font-normal pr-8">
                      <SelectValue placeholder="Выберите валюту" className="text-muted-foreground/60" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.to.map((currency: string) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filters.toCurrency && (
                    <button
                      type="button"
                      onClick={() => handleFilterChange('toCurrency', '')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </TableCell>
              <TableCell className="w-[30%]">
                  <Input
                    type="number"
                    placeholder="Введите сумму"
                    value={filters.amount}
                    onChange={(e) => handleFilterChange('amount', e.target.value)}
                  />
              </TableCell>
              <TableCell className="w-[30%]" />
            </TableRow>

            {/* Кнопка очистки */}
            <TableRow className="border-b">
              <TableCell colSpan={4} className="py-2 text-right">
                <button
                  onClick={hasActiveFilters ? clearFilters : undefined}
                  disabled={!hasActiveFilters}
                  className={`text-sm transition-colors ${hasActiveFilters ? 'text-muted-foreground hover:text-foreground' : 'text-muted-foreground opacity-50 cursor-not-allowed'}`}
                >
                  ✕ Очистить фильтры
                </button>
              </TableCell>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {filteredGroups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="text-muted-foreground">
                    По выбранным фильтрам обмены не найдены
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Попробуйте изменить параметры поиска
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredGroups.map((group) => (
                <TableRow key={group.id}>
                  <TableCell>
                    <div className="flex items-center text-lg font-medium">
                      <span className="mr-2">{getCurrencyEmoji(group.fromCurrency)}</span>
                      <span className="font-mono">{group.fromCurrency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-lg font-medium">
                      <span className="mr-2">{getCurrencyEmoji(group.toCurrency)}</span>
                      <span className="font-mono">{group.toCurrency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {group.rates.map((rate, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="text-icambio-primary">
                            {rate.minAmount && rate.maxAmount
                              ? `${rate.minAmount.toLocaleString()} – ${rate.maxAmount.toLocaleString()} ${group.fromCurrency}`
                              : rate.maxAmount
                              ? `До ${rate.maxAmount.toLocaleString()} ${group.fromCurrency}`
                              : `От ${rate.minAmount.toLocaleString()} ${group.fromCurrency}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {group.rates.map((rate, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="font-mono font-medium">
                            1 {group.fromCurrency} = {rate.rate}{' '}
                            {group.toCurrency}
                          </span>
                          {rate.is_hot && (
                            <Badge variant="secondary" className="ml-2">
                              🔥
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};