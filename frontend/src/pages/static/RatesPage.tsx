// import { useMemo } from 'react';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Card, CardContent } from '@/shared/ui/Card';
import { MOCK_EXCHANGE_RATES } from '@/lib/mock-data';

export const RatesPage = () => {
  const rates = MOCK_EXCHANGE_RATES; // Использование моковых данных напрямую

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle
        title="Курсы обмена"
        description="Актуальные курсы обмена и лимиты по различным направлениям."
      />
      <Card className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-xl">
        <CardContent className="p-0">
          {rates && <ExchangeRatesTable />}
        </CardContent>
      </Card>
    </div>
  );
}; 