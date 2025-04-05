import { PageTitle } from '@/shared/ui/PageTitle';

export const WorkingHoursPage = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <PageTitle 
          title="График работы" 
          description="Время работы нашего сервиса"
        />
        
        <div className="space-y-8">
          {/* График работы */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-2xl mr-2">🕒</span>
              <h2 className="text-2xl font-semibold">Часы работы</h2>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-icmop-background rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-icmop-primary">Будни</h3>
                  <p className="text-gray-700">с 9:00 до 17:00</p>
                </div>
                
                <div className="bg-icmop-background rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2 text-icmop-primary">Суббота</h3>
                  <p className="text-gray-700">с 9:00 до 15:00</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h3 className="text-lg font-semibold mb-2 text-red-600">Воскресенье</h3>
                <p className="text-red-600">ВЫХОДНОЙ</p>
              </div>
            </div>
          </div>

          {/* Праздничные дни */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-2xl mr-2">📅</span>
              <h2 className="text-2xl font-semibold">Праздничные дни</h2>
            </div>
            
            <div className="bg-icmop-background rounded-lg p-4">
              <p className="text-gray-700">
                В праздничные дни мы работаем по графику субботы: с 9:00 до 15:00
              </p>
            </div>
          </div>

          {/* Обратная связь */}
          <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-2xl mr-2">📞</span>
              <h2 className="text-2xl font-semibold">Всегда на связи</h2>
            </div>
            
            <div className="space-y-4 text-gray-600">
              <p>
                Если у вас возникли вопросы или нужна консультация, вы можете связаться с нами:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-icmop-primary mr-2">✉️</span>
                  <span>Email: info@icambio.com</span>
                </li>
                <li className="flex items-center">
                  <span className="text-icmop-primary mr-2">📱</span>
                  <span>WhatsApp: +7 XXX XXX XX XX</span>
                </li>
                <li className="flex items-center">
                  <span className="text-icmop-primary mr-2">✈️</span>
                  <span>Telegram: @icambio</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 