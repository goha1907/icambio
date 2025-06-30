import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const DeliveryPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <PageTitle
          title="Доставка и встречи"
          description="Зоны доставки, условия встреч и карта пунктов обмена"
        />

        {/* Важная информация */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <span className="text-amber-600 text-3xl mr-3">⚠️</span>
                <h2 className="text-2xl font-semibold text-amber-800">Важно знать</h2>
              </div>
              <p className="text-amber-800 text-lg font-semibold">
                Все операции обмена валют проводятся исключительно при личной встрече с нашим представителем. 
                Это гарантирует безопасность сделки и соответствие всем требованиям законодательства.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-icmop-background rounded-lg p-6">
                <span className="text-icmop-primary text-4xl mb-3 block">🚀</span>
                <h3 className="text-lg font-semibold mb-2">Быстро</h3>
                <p className="text-gray-600 text-sm">Встреча в течение 1-2 часов после заявки</p>
              </div>

              <div className="text-center bg-icmop-background rounded-lg p-6">
                <span className="text-icmop-primary text-4xl mb-3 block">🔒</span>
                <h3 className="text-lg font-semibold mb-2">Безопасно</h3>
                <p className="text-gray-600 text-sm">Проверенные курьеры и безопасные места встреч</p>
              </div>

              <div className="text-center bg-icmop-background rounded-lg p-6">
                <span className="text-icmop-primary text-4xl mb-3 block">💰</span>
                <h3 className="text-lg font-semibold mb-2">Выгодно</h3>
                <p className="text-gray-600 text-sm">Бесплатная доставка от определенной суммы</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Карта зон доставки */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🗺️</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Карта зон доставки</h2>
            </div>

            <p className="text-gray-600 text-lg mb-6">
              На карте отмечены все зоны, где мы осуществляем доставку и встречи. 
              Выберите удобное для вас место или предложите свой вариант в пределах зоны покрытия.
            </p>

            <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
              <iframe
                src="https://www.google.com/maps/d/u/0/embed?mid=1aeVXCKKRwQa_hMNLVg9tFKcRWCtY-Ts&ehbc=2E312F&noprof=1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Карта зон доставки iCambio"
              />
            </div>

            <div className="mt-4 text-sm text-gray-500 text-center">
              <p>Карта обновляется в режиме реального времени. Если ваш район не отмечен на карте, свяжитесь с нами для уточнения возможности доставки.</p>
            </div>
          </CardContent>
        </Card>

        {/* Зоны и тарифы */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📍</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Зоны доставки и тарифы</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-green-600 text-2xl mr-2">🟢</span>
                  <h3 className="text-lg font-semibold text-green-800">Зона А (Центр)</h3>
                </div>
                <ul className="space-y-2 text-green-700">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Бесплатно от $500</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Доставка: $10</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Время: 30-60 мин</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-blue-600 text-2xl mr-2">🔵</span>
                  <h3 className="text-lg font-semibold text-blue-800">Зона Б (Близко)</h3>
                </div>
                <ul className="space-y-2 text-blue-700">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Бесплатно от $1,000</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Доставка: $20</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Время: 1-1.5 часа</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-orange-600 text-2xl mr-2">🟠</span>
                  <h3 className="text-lg font-semibold text-orange-800">Зона В (Далеко)</h3>
                </div>
                <ul className="space-y-2 text-orange-700">
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Бесплатно от $2,000</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Доставка: $40</span>
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">•</span>
                    <span>Время: 1.5-2 часа</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Как происходит встреча */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🤝</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Как происходит встреча</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-icmop-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold mb-1">Подача заявки</h4>
                    <p className="text-gray-600 text-sm">Оформляете заявку на сайте, указывая желаемое место встречи</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-icmop-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold mb-1">Подтверждение</h4>
                    <p className="text-gray-600 text-sm">Наш менеджер связывается с вами для подтверждения деталей</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-icmop-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold mb-1">Отправка курьера</h4>
                    <p className="text-gray-600 text-sm">Курьер выезжает к месту встречи в назначенное время</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-icmop-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold mb-1">Уведомление</h4>
                    <p className="text-gray-600 text-sm">Курьер звонит вам за 15-30 минут до прибытия</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-icmop-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">5</div>
                  <div>
                    <h4 className="font-semibold mb-1">Встреча и обмен</h4>
                    <p className="text-gray-600 text-sm">Проверяете валюту, производите обмен, получаете чек</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-icmop-primary text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mr-4 mt-1 flex-shrink-0">6</div>
                  <div>
                    <h4 className="font-semibold mb-1">Завершение</h4>
                    <p className="text-gray-600 text-sm">Сделка завершена! Можете оставить отзыв о качестве сервиса</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Популярные места встреч */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">⭐</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Популярные места встреч</h2>
            </div>

            <p className="text-gray-600 text-lg mb-6">
              Рекомендуемые места для безопасных встреч в разных районах города:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-icmop-primary text-lg mr-2">🏢</span>
                  <h4 className="font-semibold">Торговые центры</h4>
                </div>
                <p className="text-gray-600 text-sm">Безопасные общественные места с хорошей проходимостью</p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-icmop-primary text-lg mr-2">🚇</span>
                  <h4 className="font-semibold">Станции метро</h4>
                </div>
                <p className="text-gray-600 text-sm">Удобные точки с хорошим транспортным сообщением</p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-icmop-primary text-lg mr-2">🏦</span>
                  <h4 className="font-semibold">Банки и офисы</h4>
                </div>
                <p className="text-gray-600 text-sm">Деловые центры с видеонаблюдением</p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-icmop-primary text-lg mr-2">☕</span>
                  <h4 className="font-semibold">Кафе и рестораны</h4>
                </div>
                <p className="text-gray-600 text-sm">Комфортные места для спокойного проведения сделки</p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-icmop-primary text-lg mr-2">🏨</span>
                  <h4 className="font-semibold">Гостиницы</h4>
                </div>
                <p className="text-gray-600 text-sm">Лобби отелей - безопасная и комфортная зона</p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <span className="text-icmop-primary text-lg mr-2">🅿️</span>
                  <h4 className="font-semibold">Парковки ТЦ</h4>
                </div>
                <p className="text-gray-600 text-sm">Для встреч на автомобиле в безопасной зоне</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Правила безопасности */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🛡️</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Правила безопасности</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">✅ Рекомендуется</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Встречаться в людных общественных местах</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Проверять документы курьера</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Пересчитывать валюту при получении</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Сохранять чек до завершения сделки</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span>Сообщать об изменениях заранее</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-red-600">❌ Не рекомендуется</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Встречаться в безлюдных местах</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Передавать деньги без проверки</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Назначать встречи поздно вечером</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Приходить с крупными суммами наличных</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">•</span>
                    <span>Игнорировать звонки от курьера</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Контакты */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📞</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Контакты для вопросов по доставке</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-icmop-background rounded-lg p-6 text-center">
                <span className="text-icmop-primary text-2xl mb-3 block">📱</span>
                <h4 className="font-semibold mb-2">WhatsApp</h4>
                <p className="text-gray-600">+7 (999) 123-45-67</p>
                <p className="text-gray-500 text-sm mt-1">Быстрые ответы 24/7</p>
              </div>

              <div className="bg-icmop-background rounded-lg p-6 text-center">
                <span className="text-icmop-primary text-2xl mb-3 block">✉️</span>
                <h4 className="font-semibold mb-2">Email</h4>
                <p className="text-gray-600">delivery@icambio.com</p>
                <p className="text-gray-500 text-sm mt-1">Ответ в течение часа</p>
              </div>

              <div className="bg-icmop-background rounded-lg p-6 text-center">
                <span className="text-icmop-primary text-2xl mb-3 block">💬</span>
                <h4 className="font-semibold mb-2">Telegram</h4>
                <p className="text-gray-600">@icambio_delivery</p>
                <p className="text-gray-500 text-sm mt-1">Оперативная поддержка</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};