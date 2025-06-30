import { useMemo, useState } from 'react';
import { ExchangeRate } from '@/features/exchange/types';
import { MOCK_EXCHANGE_RATES } from '@/lib/mock-data';
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
        processed = processed.filter(group => {
          return group.rates.some(rate => {
            const minAmount = rate.minAmount;
            const maxAmount = rate.maxAmount || Infinity;
            return amount >= minAmount && amount <= maxAmount;
          });
        });
      }
    }

    return processed;
  }, [groupedRates, filters]);

  // Обработчики изменения фильтров
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '__clear__' ? '' : value
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
      {/* Заголовок с кнопкой очистки */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-icmop-primary">Текущие курсы обмена</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ✕ Очистить
          </button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                filterComponent={
                  <Select 
                    value={filters.fromCurrency || undefined} 
                    onValueChange={(value) => handleFilterChange('fromCurrency', value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Все" className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__clear__">Все</SelectItem>
                      {currencies.from.map((currency: string) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              >
                Отдаете
              </TableHead>
              
              <TableHead 
                filterComponent={
                  <Select 
                    value={filters.toCurrency || undefined} 
                    onValueChange={(value) => handleFilterChange('toCurrency', value)}
                  >
                    <SelectTrigger className="text-foreground">
                      <SelectValue placeholder="Все" className="text-muted-foreground" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__clear__">Все</SelectItem>
                      {currencies.to.map((currency: string) => (
                        <SelectItem key={currency} value={currency}>
                          {currency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                }
              >
                Получаете
              </TableHead>
              
              <TableHead 
                filterComponent={
                  <Input
                    type="number"
                    placeholder="Введите сумму"
                    value={filters.amount}
                    onChange={(e) => handleFilterChange('amount', e.target.value)}
                  />
                }
              >
                Сумма
              </TableHead>
              
              <TableHead>Курсы</TableHead>
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
                      <span className="font-mono">{group.fromCurrency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-lg font-medium">
                      <span className="font-mono">{group.toCurrency}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {group.rates.map((rate, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <span className="text-icmop-primary">
                            {rate.maxAmount 
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