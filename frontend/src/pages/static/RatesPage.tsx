import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';

export const RatesPage = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    // Имитация обновления курсов каждые 30 секунд
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const formatLastUpdated = (date: Date) => {
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto space-y-8">
      <PageTitle
          title="Курсы обмена валют"
          description="Актуальные курсы покупки и продажи валют с обновлением в режиме реального времени"
        />

        {/* Важная информация о курсах */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <span className="text-green-600 text-4xl mb-3 block">📈</span>
                <h3 className="text-lg font-semibold mb-2 text-green-800">Выгодные курсы</h3>
                <p className="text-green-700 text-sm">
                  Наши курсы основаны на межбанковских котировках и обновляются в режиме реального времени
                </p>
              </div>

              <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                <span className="text-blue-600 text-4xl mb-3 block">🔄</span>
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Автообновление</h3>
                <p className="text-blue-700 text-sm">
                  Курсы обновляются каждые 30 секунд для обеспечения максимальной актуальности
                </p>
              </div>

              <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <span className="text-purple-600 text-4xl mb-3 block">🔒</span>
                <h3 className="text-lg font-semibold mb-2 text-purple-800">Фиксация курса</h3>
                <p className="text-purple-700 text-sm">
                  Курс фиксируется на 2 часа после подтверждения заказа
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Статус обновления */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                <span className="text-sm text-gray-600">
                  Курсы обновляются в режиме реального времени
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <span className="mr-2">🕐</span>
                <span>Последнее обновление: {formatLastUpdated(lastUpdated)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Таблица курсов */}
        <Card>
        <CardContent className="p-0">
            <div className="p-6 sm:p-8 border-b border-gray-200">
              <div className="flex items-center mb-4">
                <span className="text-icmop-primary text-3xl mr-3">💱</span>
                <h2 className="text-2xl font-semibold text-icmop-primary">Актуальные курсы</h2>
              </div>
              <p className="text-gray-600">
                Все курсы указаны за 1 единицу валюты. Минимальная сумма обмена — $100 или эквивалент.
              </p>
            </div>
            
            <ExchangeRatesTable />
          </CardContent>
        </Card>

        {/* Объяснение курсов */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">💡</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Как читать курсы</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-green-600">📊 Курс покупки</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800 font-semibold mb-2">Мы покупаем у вас валюту</p>
                  <p className="text-green-700 text-sm">
                    Курс, по которому мы принимаем от вас иностранную валюту и выдаем рубли
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-green-800 text-sm">
                    <strong>Пример:</strong> Курс покупки USD 95.50 ₽ означает, что за 1 доллар 
                    мы выдадим вам 95.50 рублей
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-blue-600">📈 Курс продажи</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 font-semibold mb-2">Мы продаем вам валюту</p>
                  <p className="text-blue-700 text-sm">
                    Курс, по которому мы продаем вам иностранную валюту за рубли
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Пример:</strong> Курс продажи USD 97.50 ₽ означает, что 1 доллар 
                    будет стоить вам 97.50 рублей
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Факторы влияния на курс */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">⚡</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Что влияет на курсы</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-xl mr-2">🏦</span>
                  <h4 className="font-semibold">Центральный банк</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Официальные курсы ЦБ РФ служат основой для расчета наших курсов
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-xl mr-2">📊</span>
                  <h4 className="font-semibold">Межбанковский рынок</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Котировки крупных банков и финансовых институтов
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-xl mr-2">🌍</span>
                  <h4 className="font-semibold">Мировые события</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Экономические и политические события влияют на волатильность
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-xl mr-2">📈</span>
                  <h4 className="font-semibold">Спрос и предложение</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Текущий спрос клиентов на различные валюты
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-xl mr-2">⏰</span>
                  <h4 className="font-semibold">Время суток</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Активность торговых сессий в разных часовых поясах
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-xl mr-2">💼</span>
                  <h4 className="font-semibold">Операционные расходы</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Расходы на логистику, безопасность и обслуживание
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Лимиты и условия */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📋</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Лимиты и условия</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">💰 Лимиты операций</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">Минимальная сумма</span>
                    <span className="font-semibold text-icmop-primary">$100</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">Без верификации</span>
                    <span className="font-semibold text-icmop-primary">до $1,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">С базовой верификацией</span>
                    <span className="font-semibold text-icmop-primary">до $10,000</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">С полной верификацией</span>
                    <span className="font-semibold text-icmop-primary">без ограничений</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">⏱️ Время действия</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">Фиксация курса</span>
                    <span className="font-semibold text-icmop-primary">2 часа</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">Время доставки</span>
                    <span className="font-semibold text-icmop-primary">30 мин - 2 часа</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">Обновление курсов</span>
                    <span className="font-semibold text-icmop-primary">каждые 30 сек</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-icmop-background rounded-lg">
                    <span className="text-gray-700">Режим работы</span>
                    <span className="font-semibold text-icmop-primary">24/7</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Часто задаваемые вопросы о курсах */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">❓</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Вопросы о курсах</h2>
            </div>

            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-800">
                  Почему ваши курсы отличаются от курсов ЦБ РФ?
                </h4>
                <p className="text-gray-600 text-sm">
                  Курсы ЦБ РФ являются справочными. Наши курсы формируются на основе реальных рыночных 
                  котировок и включают операционные расходы на доставку, безопасность и обслуживание.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-800">
                  Можно ли договориться о более выгодном курсе?
                </h4>
                <p className="text-gray-600 text-sm">
                  Наши курсы уже максимально выгодные. Для крупных операций (от $10,000) 
                  возможны индивидуальные условия. Свяжитесь с нашими менеджерами для обсуждения.
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-800">
                  Что делать, если курс изменился после заказа?
                </h4>
                <p className="text-gray-600 text-sm">
                  После подтверждения заказа курс фиксируется на 2 часа. В течение этого времени 
                  курс остается неизменным независимо от рыночных колебаний.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Призыв к действию */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="bg-gradient-to-r from-icmop-primary to-blue-600 rounded-lg p-8 text-center text-white">
              <span className="text-4xl mb-4 block">🚀</span>
              <h2 className="text-2xl font-semibold mb-4">Готовы обменять валюту?</h2>
              <p className="mb-6 opacity-90">
                Воспользуйтесь нашими выгодными курсами прямо сейчас! 
                Быстрая доставка и безопасные операции.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/exchange" 
                  className="bg-white text-icmop-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Обменять валюту
                </a>
                <a 
                  href="/faq" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-icmop-primary transition-colors"
                >
                  Задать вопрос
                </a>
              </div>
            </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}; 