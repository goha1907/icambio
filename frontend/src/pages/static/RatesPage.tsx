import { useMemo } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import { mockExchangeRates } from '@/mocks/exchange-data';

export const RatesPage = () => {
  const rates = useMemo(() => mockExchangeRates, []);

  return (
    <div className="page-container">
      <div className="page-content">
        <PageTitle 
          title="Текущие курсы обмена" 
          description="Актуальные курсы обмена валют на сегодня"
        />
        <ExchangeRatesTable rates={rates} />
      </div>
    </div>
  );
}; 