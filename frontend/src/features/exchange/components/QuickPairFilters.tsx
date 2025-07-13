import React from 'react';
import { Badge } from '@/shared/ui/Badge';
import { MOCK_EXCHANGE_RATES_DB, getCurrencyById } from '@/shared/lib/mock-data-db';

interface QuickPairFiltersProps {
  onFilterSelect: (fromCurrency: string, toCurrency: string) => void;
}

export const QuickPairFilters: React.FC<QuickPairFiltersProps> = ({ onFilterSelect }) => {
  // Получаем только пары, которые должны быть в фильтрах
  // visible: true - курс доступен на сайте
  // in_filter: true - показывать в фильтрах
  const filterPairs = MOCK_EXCHANGE_RATES_DB.filter(rate => 
    rate.visible && rate.in_filter
  );

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Популярные направления обмена:
      </h3>
      <div className="flex flex-wrap gap-2">
        {filterPairs.map((rate) => {
          const fromCurrency = getCurrencyById(rate.currency_from_id);
          const toCurrency = getCurrencyById(rate.currency_to_id);
          
          if (!fromCurrency || !toCurrency) return null;
          
          return (
            <Badge
              key={`${fromCurrency.code}-${toCurrency.code}`}
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white transition-colors"
              onClick={() => onFilterSelect(fromCurrency.code, toCurrency.code)}
            >
              {fromCurrency.code} → {toCurrency.code}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}; 