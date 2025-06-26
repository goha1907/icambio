import { useMemo, useState } from 'react';
import { ExchangeRate } from '@/features/exchange/types';
import { MOCK_EXCHANGE_RATES } from '@/lib/mock-data';

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
    <div className="exchange-rates bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Текущие курсы обмена</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Поиск по валюте..."
          className="px-4 py-2 border rounded-lg w-full md:w-64"
          value={filterCurrency}
          onChange={(e) => setFilterCurrency(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Направление обмена
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Курсы и лимиты
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {formattedGroups.map((group) => (
              <tr key={group.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center text-lg font-medium">
                    <span className="font-mono">{group.fromCurrency}</span>
                    <span className="mx-2">→</span>
                    <span className="font-mono">{group.toCurrency}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {group.rates.map((rate, idx) => (
                      <div key={idx} className="flex items-center text-sm">
                        <span className="text-gray-500 mr-2">
                          {rate.maxAmount 
                            ? `До ${rate.maxAmount} ${group.fromCurrency}:`
                            : `От ${rate.minAmount} ${group.fromCurrency}:`
                          }
                        </span>
                        <span className="font-medium font-mono">
                          1 {group.fromCurrency} = {rate.rate} {group.toCurrency}
                        </span>
                        {idx === 0 && rate.from_currency.code === 'USD' && rate.to_currency.code === 'ARS' && (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 rounded text-xs">🔥</span>
                        )}
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};