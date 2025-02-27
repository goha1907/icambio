// frontend/src/components/exchange/ExchangeRatesTable.tsx
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import type { Currency, ExchangeRate } from '@/types';

interface ExchangeRatesTableProps {
  rates: ExchangeRate[];
  currencies: Currency[];
}

export const ExchangeRatesTable = ({ rates, currencies }: ExchangeRatesTableProps) => {
  const [sortField, setSortField] = useState<string>('fromCurrency');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Получение названия валюты по коду
  const getCurrencyName = (code: string): string => {
    const currency = currencies.find(c => c.code === code);
    return currency ? `${currency.name} (${currency.symbol})` : code;
  };

  // Получение числа десятичных знаков для валюты
  const getCurrencyDecimals = (code: string): number => {
    const currency = currencies.find(c => c.code === code);
    return currency?.decimals || 2;
  };

  // Функция сортировки
  const sortRates = (a: ExchangeRate, b: ExchangeRate): number => {
    let valueA: string | number = a[sortField as keyof ExchangeRate] as string | number;
    let valueB: string | number = b[sortField as keyof ExchangeRate] as string | number;
    
    // Для числовых полей
    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }
    
    // Для строковых полей
    valueA = String(valueA).toLowerCase();
    valueB = String(valueB).toLowerCase();
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  };

  // Обработчик клика по заголовку для сортировки
  const handleSort = (field: string) => {
    if (sortField === field) {
      // Если поле уже выбрано, меняем направление
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Если выбрано новое поле, устанавливаем его и сортировку по возрастанию
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Время последнего обновления
  const lastUpdateTime = new Date().toLocaleTimeString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Актуальные курсы обмена</CardTitle>
        <p className="text-sm text-gray-500">Обновлено: {lastUpdateTime}</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('fromCurrency')}
                >
                  Валюта отдачи
                  {sortField === 'fromCurrency' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('toCurrency')}
                >
                  Валюта получения
                  {sortField === 'toCurrency' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('minAmount')}
                >
                  Мин. сумма
                  {sortField === 'minAmount' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('rate')}
                >
                  Курс
                  {sortField === 'rate' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...rates].sort(sortRates).map((rate, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCurrencyName(rate.fromCurrency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCurrencyName(rate.toCurrency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rate.minAmount} {rate.fromCurrency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {rate.rate.toFixed(getCurrencyDecimals(rate.toCurrency))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};