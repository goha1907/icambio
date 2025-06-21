// import { useMemo } from 'react';
import { PageTitle } from '@/shared/ui/PageTitle';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import { useExchangeRates } from '@/features/exchange/hooks/useExchangeRate';

export const RatesPage = () => {
  const { data: rates, isLoading, isError } = useExchangeRates();

  return (
    <div className="page-container">
      <div className="page-content">
        <PageTitle 
          title="Текущие курсы обмена" 
          description="Актуальные курсы обмена валют на сегодня"
        />
        {isLoading && <p>Загрузка курсов...</p>}
        {isError && <p>Ошибка загрузки курсов.</p>}
        {rates && <ExchangeRatesTable rates={rates} />}
      </div>
    </div>
  );
}; 