import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import { ExchangeHistory } from '@/features/profile/components/ExchangeHistory';
import { PageTitle } from '@/shared/ui/PageTitle';
import { MOCK_EXCHANGE_HISTORY } from '@/lib/mock-data';

/**
 * Тестовая страница для проверки обеих таблиц
 * Демонстрирует единообразие дизайна и функциональность фильтров
 */
export const TestTablesPage = () => {
  return (
    <div className="container mx-auto max-w-7xl py-8 space-y-12">
      <PageTitle title="Тестирование таблиц" />
      
      {/* Таблица курсов обмена */}
      <section>
        <ExchangeRatesTable />
      </section>
      
      {/* История обменов */}
      <section>
        <ExchangeHistory exchanges={MOCK_EXCHANGE_HISTORY} />
      </section>
    </div>
  );
}; 