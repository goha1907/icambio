import { useMemo, useState } from 'react';
import { MOCK_EXCHANGE_RATES_DB, MOCK_CURRENCIES_DB } from '@/shared/lib/mock-data-db';

// Вспомогательные функции для получения валюты по id
const getCurrencyById = (id: number) => MOCK_CURRENCIES_DB.find(c => c.id === id);

export const ExchangeRatesTable = () => {
  // Состояния фильтров
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [amount, setAmount] = useState('');

  // Получаем все видимые курсы
  const rates = useMemo(() => MOCK_EXCHANGE_RATES_DB.filter(rate => rate.visible), []);

  // Получаем уникальные валюты для фильтров
  const fromCurrencies = useMemo(() => {
    return [...new Set(rates.map(rate => getCurrencyById(rate.currency_from_id)?.code).filter(Boolean))];
  }, [rates]);
  const toCurrencies = useMemo(() => {
    return [...new Set(rates.map(rate => getCurrencyById(rate.currency_to_id)?.code).filter(Boolean))];
  }, [rates]);

  // Фильтрация курсов
  const filteredRates = useMemo(() => {
    return rates.filter(rate => {
      const fromMatch = !fromCurrency || getCurrencyById(rate.currency_from_id)?.code === fromCurrency;
      const toMatch = !toCurrency || getCurrencyById(rate.currency_to_id)?.code === toCurrency;
      const amountMatch = !amount || (Number(amount) >= rate.min_amount && (!rate.max_amount || Number(amount) <= rate.max_amount));
      return fromMatch && toMatch && amountMatch;
    });
  }, [rates, fromCurrency, toCurrency, amount]);

  // Очистка фильтров
  const clearFilters = () => {
    setFromCurrency('');
    setToCurrency('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Отдаете</label>
          <select value={fromCurrency} onChange={e => setFromCurrency(e.target.value)} className="border rounded px-3 py-2 w-40">
            <option value="">Все</option>
            {fromCurrencies.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Получаете</label>
          <select value={toCurrency} onChange={e => setToCurrency(e.target.value)} className="border rounded px-3 py-2 w-40">
            <option value="">Все</option>
            {toCurrencies.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Сумма</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="border rounded px-3 py-2 w-40" placeholder="Введите сумму" />
        </div>
        <button onClick={clearFilters} className="ml-2 px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 text-sm border">Очистить фильтры</button>
      </div>
      {/* Таблица */}
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Отдаете</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Получаете</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Курс</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Лимиты</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredRates.map((rate, idx) => {
              const from = getCurrencyById(rate.currency_from_id);
              const to = getCurrencyById(rate.currency_to_id);
              return (
                <tr key={rate.id + '-' + idx}>
                  <td className="px-4 py-2 font-medium">{from?.code}</td>
                  <td className="px-4 py-2 font-medium">{to?.code}</td>
                  <td className="px-4 py-2">
                    <span className="font-semibold">{rate.rate}</span>
                    {rate.is_hot && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-orange-50 text-orange-700 text-xs align-middle">🔥 Горячий</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">
                    {rate.min_amount} - {rate.max_amount || '∞'}
                  </td>
                </tr>
              );
            })}
            {filteredRates.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">Курсы по вашему запросу не найдены</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};