import { PageTitle } from '@/shared/ui/PageTitle';

export const DeliveryPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <PageTitle 
          title="Доставка" 
          description="Информация о зонах и условиях доставки"
        />
        
        <div className="space-y-8">
          {/* Основная информация */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-icmop-primary text-2xl mr-2">💸</span>
                  <h3 className="text-xl font-semibold">БЕСПЛАТНО</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Минимальная сумма заказа для бесплатной доставки варьируется в зависимости от района.
                </p>
                <div className="flex items-center">
                  <span className="text-icmop-primary text-2xl mr-2">📍</span>
                  <h3 className="text-xl font-semibold">Зоны доставки</h3>
                </div>
              </div>
              <div>
                <div className="flex items-center mb-4">
                  <span className="text-icmop-accent text-2xl mr-2">⚠️</span>
                  <h3 className="text-xl font-semibold">Важно!</h3>
                </div>
                <p className="text-gray-600 font-semibold">
                  Все сделки ТОЛЬКО при личной встрече
                </p>
              </div>
            </div>
          </div>

          {/* Карта зон доставки */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-icmop-primary">Карта зон доставки</h2>
            <div className="aspect-video bg-gray-100 rounded-lg">
              {/* TODO: Добавить карту */}
            </div>
          </div>

          {/* Условия доставки */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-icmop-primary">Условия доставки</h2>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="text-icmop-primary mr-2">✓</span>
                <span>Доставка осуществляется в течение 2 часов после подтверждения заказа</span>
              </li>
              <li className="flex items-start">
                <span className="text-icmop-primary mr-2">✓</span>
                <span>Курьер свяжется с вами за 30 минут до прибытия</span>
              </li>
              <li className="flex items-start">
                <span className="text-icmop-primary mr-2">✓</span>
                <span>Оплата производится только при личной встрече</span>
              </li>
              <li className="flex items-start">
                <span className="text-icmop-primary mr-2">✓</span>
                <span>Возможен выбор удобного для вас места встречи в пределах зоны доставки</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}; 