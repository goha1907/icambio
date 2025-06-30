import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const RulesPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto space-y-8">
        <PageTitle
          title="Правила обмена валют"
          description="Подробные правила и условия обмена валют в iCambio. Обязательны к ознакомлению перед совершением операций"
        />

        {/* Важная информация */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-red-600 text-3xl mr-3">⚠️</span>
                <h2 className="text-xl font-bold text-red-800">Важно!</h2>
              </div>
              <p className="text-red-700 leading-relaxed">
                Совершая обмен валют через наш сервис, вы автоматически соглашаетесь с данными правилами. 
                Пожалуйста, внимательно ознакомьтесь с условиями перед началом операции.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Общие условия */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📋</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Общие условия обмена</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">🕒 Время работы</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Понедельник - Пятница:</strong> 09:00 - 21:00</li>
                  <li>• <strong>Суббота - Воскресенье:</strong> 10:00 - 18:00</li>
                  <li>• <strong>Праздничные дни:</strong> по согласованию</li>
                  <li>• <strong>Онлайн заявки:</strong> принимаются круглосуточно</li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">💰 Лимиты операций</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Минимальные суммы:</h4>
                    <ul className="space-y-1 text-blue-600 text-sm">
                      <li>• USDT: от $10</li>
                      <li>• USD наличные: от $50</li>
                      <li>• ARS: от $5,000</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-700 mb-2">Максимальные суммы:</h4>
                    <ul className="space-y-1 text-blue-600 text-sm">
                      <li>• Без верификации: до $1,000</li>
                      <li>• С базовой верификацией: до $10,000</li>
                      <li>• С полной верификацией: без ограничений</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">⏱️ Время обработки</h3>
                <ul className="space-y-2 text-green-700">
                  <li>• <strong>Криптовалюты:</strong> 5-15 минут после подтверждения</li>
                  <li>• <strong>Наличные доллары:</strong> 30-60 минут (встреча)</li>
                  <li>• <strong>Банковские переводы:</strong> 1-3 рабочих дня</li>
                  <li>• <strong>Крупные суммы (свыше $5,000):</strong> до 24 часов</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Процедура обмена */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🔄</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Процедура обмена</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-lg">1</span>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">Создание заявки</h3>
                <p className="text-blue-600 text-sm">Выберите валюты и сумму обмена</p>
              </div>

              <div className="text-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6">
                <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-600 font-bold text-lg">2</span>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Подтверждение</h3>
                <p className="text-green-600 text-sm">Проверьте данные и подтвердите операцию</p>
              </div>

              <div className="text-center bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6">
                <div className="bg-yellow-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-yellow-600 font-bold text-lg">3</span>
                </div>
                <h3 className="font-semibold text-yellow-800 mb-2">Оплата</h3>
                <p className="text-yellow-600 text-sm">Переведите средства на указанные реквизиты</p>
              </div>

              <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
                <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-lg">4</span>
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">Получение</h3>
                <p className="text-purple-600 text-sm">Получите обменянные средства</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Требования к клиентам */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">👤</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Требования к клиентам</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">✅ Обязательные требования</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Возраст от 18 лет</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Действующий документ, удостоверяющий личность</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Согласие на обработку персональных данных</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Подтверждение источника средств (для крупных сумм)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">✓</span>
                    <span className="text-gray-700">Соблюдение правил AML/KYC</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">❌ Ограничения</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span className="text-gray-700">Операции с подозрительными средствами</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span className="text-gray-700">Обмен для третьих лиц без доверенности</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span className="text-gray-700">Использование чужих банковских карт</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span className="text-gray-700">Нарушение требований валютного законодательства</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span className="text-gray-700">Предоставление ложной информации</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Курсы и комиссии */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">💱</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Курсы и комиссии</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">📈 Формирование курсов</h3>
                <ul className="space-y-2 text-blue-700">
                  <li>• Курсы обновляются в режиме реального времени</li>
                  <li>• Базируются на международных биржевых котировках</li>
                  <li>• Учитывают текущую рыночную ситуацию и ликвидность</li>
                  <li>• Могут изменяться в зависимости от суммы операции</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-800 mb-3">💰 Комиссии</h3>
                  <ul className="space-y-2 text-green-700">
                    <li>• <strong>Криптовалюты:</strong> от 0.5%</li>
                    <li>• <strong>Наличные:</strong> от 1%</li>
                    <li>• <strong>Банковские переводы:</strong> от 2%</li>
                    <li>• <strong>VIP клиенты:</strong> индивидуальные условия</li>
                  </ul>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">🔒 Фиксация курса</h3>
                  <ul className="space-y-2 text-yellow-700">
                    <li>• Курс фиксируется на 15 минут</li>
                    <li>• Для крупных сумм - индивидуально</li>
                    <li>• Возможность предварительного резерва</li>
                    <li>• Гарантия исполнения по зафиксированному курсу</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Безопасность и риски */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🛡️</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Безопасность и риски</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">🔐 Меры безопасности</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">🔒</span>
                    <span className="text-gray-700">SSL-шифрование всех данных</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">🔒</span>
                    <span className="text-gray-700">Двухфакторная аутентификация</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">🔒</span>
                    <span className="text-gray-700">Холодное хранение криптовалют</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">🔒</span>
                    <span className="text-gray-700">Регулярный аудит безопасности</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2 mt-1">🔒</span>
                    <span className="text-gray-700">Система мониторинга транзакций</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-4">⚠️ Возможные риски</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                    <span className="text-gray-700">Волатильность курсов криптовалют</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                    <span className="text-gray-700">Технические сбои платежных систем</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                    <span className="text-gray-700">Изменения в законодательстве</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                    <span className="text-gray-700">Форс-мажорные обстоятельства</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">⚠️</span>
                    <span className="text-gray-700">Ошибки при указании реквизитов</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ответственность сторон */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">⚖️</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Ответственность сторон</h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-blue-800 mb-4">🏢 Ответственность iCambio</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-700 mb-2">Мы гарантируем:</h4>
                    <ul className="space-y-1 text-blue-600 text-sm">
                      <li>• Исполнение операций по зафиксированному курсу</li>
                      <li>• Конфиденциальность персональных данных</li>
                      <li>• Соблюдение сроков обработки заявок</li>
                      <li>• Техническую поддержку клиентов</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Ограничения ответственности:</h4>
                    <ul className="space-y-1 text-gray-600 text-sm">
                      <li>• Не отвечаем за изменения курсов после фиксации</li>
                      <li>• Не компенсируем упущенную выгоду</li>
                      <li>• Ответственность ограничена суммой операции</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-4">👤 Ответственность клиента</h3>
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-700 mb-2">Клиент обязуется:</h4>
                    <ul className="space-y-1 text-green-600 text-sm">
                      <li>• Предоставлять достоверную информацию</li>
                      <li>• Соблюдать требования валютного законодательства</li>
                      <li>• Своевременно уведомлять об изменениях</li>
                      <li>• Нести ответственность за свои действия</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-medium text-red-700 mb-2">Клиент несет ответственность за:</h4>
                    <ul className="space-y-1 text-red-600 text-sm">
                      <li>• Правильность указанных реквизитов</li>
                      <li>• Легальность источника средств</li>
                      <li>• Соблюдение налогового законодательства</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Споры и разрешение конфликтов */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🤝</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Споры и разрешение конфликтов</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-3">📞 Досудебное урегулирование</h3>
                <p className="text-green-700 leading-relaxed mb-4">
                  Мы стремимся решать все спорные вопросы мирным путем. При возникновении разногласий 
                  обращайтесь в нашу службу поддержки для поиска взаимовыгодного решения.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">📧</span>
                    <p className="text-sm text-green-600">support@icambio.com</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">📱</span>
                    <p className="text-sm text-green-600">WhatsApp: +54 11 1234-5678</p>
                  </div>
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">💬</span>
                    <p className="text-sm text-green-600">Telegram: @icambio_support</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">⚖️ Судебное разрешение споров</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Споры рассматриваются в соответствии с законодательством Аргентины</li>
                  <li>• Подсудность определяется по месту нахождения ответчика</li>
                  <li>• Возможно применение процедур медиации и арбитража</li>
                  <li>• Исковая давность составляет 3 года с момента возникновения спора</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Изменения правил */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="bg-gradient-to-r from-icmop-primary to-blue-600 rounded-lg p-8 text-center text-white">
              <span className="text-4xl mb-4 block">📝</span>
              <h2 className="text-2xl font-semibold mb-4">Изменения в правилах</h2>
              <p className="mb-6 opacity-90 leading-relaxed">
                iCambio оставляет за собой право вносить изменения в данные правила. 
                Все изменения публикуются на сайте и вступают в силу с момента публикации. 
                Продолжение использования сервиса означает согласие с новыми правилами.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="/exchange" 
                  className="bg-white text-icmop-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Начать обмен
                </a>
                <a 
                  href="/faq" 
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-icmop-primary transition-colors"
                >
                  Частые вопросы
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
