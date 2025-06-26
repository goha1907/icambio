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
import { Input } from '@/shared/ui/Input';
import { Badge } from '@/shared/ui/Badge';

interface ExchangeRatesTableProps {
  // rates: ExchangeRate[]; // Убираем пропс
}

export const ExchangeRatesTable = ({ /* rates */ }: ExchangeRatesTableProps) => {
  const rates = MOCK_EXCHANGE_RATES;
  const [filterCurrency, setFilterCurrency] = useState<string>('');

  // Группируем курсы по парам валют
  const groupedRates = useMemo(() => {
    const groups = rates.reduce((acc, rate) => {
      const key = `${rate.from_currency.code}-${rate.to_currency.code}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(rate);
      return acc;
    }, {} as Record<string, ExchangeRate[]>);

    return Object.values(groups);
  }, [rates]);

  // Мемоизация форматированных данных для таблицы
  const formattedGroups = useMemo(() => {
    let processed = groupedRates.map(rateGroup => {
      return {
        id: rateGroup[0].id,
        fromCurrency: rateGroup[0].from_currency.code,
        toCurrency: rateGroup[0].to_currency.code,
        rates: rateGroup.sort((a, b) => a.minAmount - b.minAmount),
      };
    });

    // Фильтрация
    if (filterCurrency) {
      processed = processed.filter(
        (group) =>
          group.fromCurrency.toLowerCase().includes(filterCurrency.toLowerCase()) ||
          group.toCurrency.toLowerCase().includes(filterCurrency.toLowerCase())
      );
    }

    return processed;
  }, [groupedRates, filterCurrency]);

  return (
    <div className="rounded-xl bg-white p-6 shadow-lg sm:p-8">
      <h2 className="mb-6 text-2xl font-bold">Текущие курсы обмена</h2>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Поиск по валюте..."
          className="w-full md:w-64 placeholder:text-icmop-primary"
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Направление обмена</TableHead>
              <TableHead>Курсы и лимиты</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {formattedGroups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>
                  <div className="flex items-center text-lg font-medium">
                    <span className="font-mono">{group.fromCurrency}</span>
                    <span className="mx-2">→</span>
                    <span className="font-mono">{group.toCurrency}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    {group.rates.map((rate, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="mr-2 text-icmop-primary">
                          {rate.maxAmount 
                            ? `До ${rate.maxAmount} ${group.fromCurrency}:`
                            : `От ${rate.minAmount} ${group.fromCurrency}:`}
                        </span>
                        <span className="font-mono font-medium">
                          1 {group.fromCurrency} = {rate.rate}{' '}
                          {group.toCurrency}
                        </span>
                        {idx === 0 &&
                          rate.from_currency.code === 'USD' &&
                          rate.to_currency.code === 'ARS' && (
                            <Badge variant="secondary" className="ml-2">
                              🔥
                            </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};