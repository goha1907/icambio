import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const WorkingHoursPage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isWorkingHours, setIsWorkingHours] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Проверяем рабочие часы (по времени Буэнос-Айреса GMT-3)
      const day = now.getDay(); // 0 = воскресенье, 1 = понедельник, ...
      const hours = now.getHours();
      
      if (day === 0) { // Воскресенье
        setIsWorkingHours(false);
      } else if (day >= 1 && day <= 5) { // Понедельник-Пятница
        setIsWorkingHours(hours >= 9 && hours < 21);
      } else if (day === 6) { // Суббота
        setIsWorkingHours(hours >= 10 && hours < 18);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Argentina/Buenos_Aires'
    });
  };

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <PageTitle 
          title="График работы iCambio"
          description="Подробная информация о времени работы нашего сервиса обмена валют"
        />
        
        {/* Текущее время и статус */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center mb-4">
                <span className="text-4xl mr-3">🌎</span>
                <h2 className="text-2xl font-semibold text-blue-800">Текущее время в Буэнос-Айресе</h2>
              </div>
              
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-900">
                  {formatTime(currentTime)}
                </div>
                <div className="text-lg text-blue-700">
                  {formatDate(currentTime)}
                </div>
                
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                  isWorkingHours 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  <span className={`mr-2 ${isWorkingHours ? 'text-green-500' : 'text-red-500'}`}>
                    {isWorkingHours ? '🟢' : '🔴'}
                  </span>
                  {isWorkingHours ? 'Сейчас работаем' : 'Сейчас не работаем'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Основной график работы */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🕒</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Часы работы</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Понедельник-Пятница */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                <div className="text-center">
                  <span className="text-3xl mb-3 block">💼</span>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Понедельник - Пятница</h3>
                  <div className="text-2xl font-bold text-green-700 mb-2">09:00 - 21:00</div>
                  <p className="text-green-600 text-sm">Полный рабочий день</p>
                  <div className="mt-3 text-xs text-green-500">
                    12 часов работы
                  </div>
                </div>
                </div>
                
              {/* Суббота */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border-2 border-blue-200">
                <div className="text-center">
                  <span className="text-3xl mb-3 block">🌅</span>
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Суббота</h3>
                  <div className="text-2xl font-bold text-blue-700 mb-2">10:00 - 18:00</div>
                  <p className="text-blue-600 text-sm">Сокращенный день</p>
                  <div className="mt-3 text-xs text-blue-500">
                    8 часов работы
                  </div>
                </div>
              </div>

              {/* Воскресенье */}
              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border-2 border-red-200">
                <div className="text-center">
                  <span className="text-3xl mb-3 block">🛌</span>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Воскресенье</h3>
                  <div className="text-2xl font-bold text-red-700 mb-2">ВЫХОДНОЙ</div>
                  <p className="text-red-600 text-sm">Отдыхаем</p>
                  <div className="mt-3 text-xs text-red-500">
                    Онлайн заявки принимаются
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Временные зоны */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🌍</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Часовые пояса</h2>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">🏢 Наше время</h3>
              <p className="text-purple-700 leading-relaxed">
                Мы работаем по времени <strong>Буэнос-Айреса (GMT-3)</strong>. 
                Все указанные часы работы соответствуют аргентинскому времени.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-800 mb-1">🇦🇷 Буэнос-Айрес</h4>
                <p className="text-sm text-gray-600">GMT-3</p>
                <p className="text-lg font-bold text-gray-800">
                  {formatTime(currentTime)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-800 mb-1">🇷🇺 Москва</h4>
                <p className="text-sm text-gray-600">GMT+3</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date().toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/Moscow'
                  })}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-800 mb-1">🇺🇸 Нью-Йорк</h4>
                <p className="text-sm text-gray-600">GMT-5</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/New_York'
                  })}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-800 mb-1">🇬🇧 Лондон</h4>
                <p className="text-sm text-gray-600">GMT+0</p>
                <p className="text-lg font-bold text-gray-800">
                  {new Date().toLocaleTimeString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'Europe/London'
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Особые дни */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📅</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Особые дни и праздники</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">🎉 Праздничные дни</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Национальные праздники Аргентины:</h4>
                    <ul className="space-y-1 text-yellow-600 text-sm">
                      <li>• 1 января - Новый год</li>
                      <li>• 25 мая - День революции</li>
                      <li>• 9 июля - День независимости</li>
                      <li>• 25 декабря - Рождество</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-yellow-700 mb-2">Режим работы в праздники:</h4>
                    <ul className="space-y-1 text-yellow-600 text-sm">
                      <li>• График субботы: 10:00 - 18:00</li>
                      <li>• Обработка заявок может занять больше времени</li>
                      <li>• Поддержка работает в ограниченном режиме</li>
                    </ul>
                  </div>
            </div>
          </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">⚡ Экстренные ситуации</h3>
                <p className="text-blue-700 leading-relaxed mb-4">
                  В случае технических проблем или экстренных ситуаций мы можем временно изменить график работы. 
                  Об этом мы обязательно уведомим на сайте и в социальных сетях.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center text-blue-600">
                    <span className="mr-2">📢</span>
                    <span className="text-sm">Уведомления на сайте</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <span className="mr-2">📱</span>
                    <span className="text-sm">Telegram-канал</span>
                  </div>
                  <div className="flex items-center text-blue-600">
                    <span className="mr-2">📧</span>
                    <span className="text-sm">Email-рассылка</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Онлайн услуги */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">💻</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Онлайн услуги 24/7</h2>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">🌐 Доступно круглосуточно</h3>
              <p className="text-green-700 leading-relaxed mb-4">
                Даже когда мы не работаем, вы можете пользоваться нашими онлайн услугами в любое время.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white border-2 border-green-200 rounded-lg p-6 text-center">
                <span className="text-3xl mb-3 block">📝</span>
                <h3 className="font-semibold text-green-800 mb-2">Создание заявок</h3>
                <p className="text-green-600 text-sm">Оформляйте заявки на обмен в любое время</p>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-lg p-6 text-center">
                <span className="text-3xl mb-3 block">📊</span>
                <h3 className="font-semibold text-blue-800 mb-2">Мониторинг курсов</h3>
                <p className="text-blue-600 text-sm">Отслеживайте актуальные курсы валют</p>
              </div>

              <div className="bg-white border-2 border-purple-200 rounded-lg p-6 text-center">
                <span className="text-3xl mb-3 block">📱</span>
                <h3 className="font-semibold text-purple-800 mb-2">Личный кабинет</h3>
                <p className="text-purple-600 text-sm">Управляйте своими операциями</p>
              </div>

              <div className="bg-white border-2 border-yellow-200 rounded-lg p-6 text-center">
                <span className="text-3xl mb-3 block">💬</span>
                <h3 className="font-semibold text-yellow-800 mb-2">Чат-бот</h3>
                <p className="text-yellow-600 text-sm">Получайте ответы на частые вопросы</p>
              </div>

              <div className="bg-white border-2 border-red-200 rounded-lg p-6 text-center">
                <span className="text-3xl mb-3 block">📈</span>
                <h3 className="font-semibold text-red-800 mb-2">Аналитика</h3>
                <p className="text-red-600 text-sm">Просматривайте историю операций</p>
              </div>

              <div className="bg-white border-2 border-indigo-200 rounded-lg p-6 text-center">
                <span className="text-3xl mb-3 block">🔔</span>
                <h3 className="font-semibold text-indigo-800 mb-2">Уведомления</h3>
                <p className="text-indigo-600 text-sm">Получайте SMS и email уведомления</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Контакты и поддержка */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📞</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Связь с нами</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">⏰ В рабочие часы</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">Быстрый ответ:</h4>
                    <ul className="space-y-2 text-green-600">
                      <li className="flex items-center">
                        <span className="mr-2">📱</span>
                        <span>WhatsApp: +54 11 1234-5678</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">💬</span>
                        <span>Telegram: @icambio_support</span>
                      </li>
                      <li className="flex items-center">
                        <span className="mr-2">💻</span>
                        <span>Онлайн-чат на сайте</span>
                      </li>
                    </ul>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Время ответа:</strong> 1-5 минут
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🌙 Вне рабочих часов</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-700 mb-2">Оставьте сообщение:</h4>
                    <ul className="space-y-2 text-blue-600">
                <li className="flex items-center">
                        <span className="mr-2">📧</span>
                        <span>Email: support@icambio.com</span>
                </li>
                <li className="flex items-center">
                        <span className="mr-2">📝</span>
                        <span>Форма обратной связи</span>
                </li>
                <li className="flex items-center">
                        <span className="mr-2">🎫</span>
                        <span>Система тикетов</span>
                </li>
              </ul>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Время ответа:</strong> до 2 часов в рабочее время
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Призыв к действию */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="bg-gradient-to-r from-icmop-primary to-blue-600 rounded-lg p-8 text-center text-white">
              <span className="text-4xl mb-4 block">🚀</span>
              <h2 className="text-2xl font-semibold mb-4">Готовы начать обмен?</h2>
              <p className="mb-6 opacity-90 leading-relaxed">
                {isWorkingHours 
                  ? 'Мы сейчас работаем! Создайте заявку и получите персональную поддержку.'
                  : 'Мы сейчас не работаем, но вы можете создать заявку - мы обработаем её в рабочие часы.'
                }
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/exchange" 
                  className="bg-white text-icmop-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Создать заявку
                </a>
                <a 
                  href="/rates" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-icmop-primary transition-colors"
                >
                  Посмотреть курсы
                </a>
          </div>
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 