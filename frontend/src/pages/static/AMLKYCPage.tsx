import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const AMLKYCPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto space-y-8">
        <PageTitle
          title="AML/KYC Политика"
          description="Политика противодействия отмыванию денег и процедуры идентификации клиентов"
        />

        {/* Введение */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🛡️</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Наша приверженность безопасности</h2>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              iCambio строго соблюдает международные стандарты по противодействию отмыванию денег (AML) 
              и процедуры "Знай своего клиента" (KYC). Мы обязуемся поддерживать высочайший уровень 
              безопасности и прозрачности во всех операциях.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              Данная политика описывает наши процедуры и требования, направленные на предотвращение 
              использования нашего сервиса для незаконной деятельности.
            </p>
          </CardContent>
        </Card>

        {/* Что такое AML/KYC */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📚</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Что такое AML/KYC?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-icmop-background rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-icmop-primary text-2xl mr-2">🚫</span>
                  <h3 className="text-lg font-semibold">AML (Anti-Money Laundering)</h3>
                </div>
                <p className="text-gray-600">
                  Комплекс мер по противодействию отмыванию денег и финансированию терроризма. 
                  Включает мониторинг подозрительных транзакций и соблюдение регулятивных требований.
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <span className="text-icmop-primary text-2xl mr-2">🔍</span>
                  <h3 className="text-lg font-semibold">KYC (Know Your Customer)</h3>
                </div>
                <p className="text-gray-600">
                  Процедуры идентификации и верификации клиентов для предотвращения мошенничества 
                  и обеспечения соответствия международным стандартам.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Процедуры верификации */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">✅</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Процедуры верификации</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-icmop-background to-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-icmop-primary">Уровень 1 - Базовая верификация</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Подтверждение email адреса</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Подтверждение номера телефона</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Лимит операций: до $1,000 в день</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-icmop-background to-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-icmop-primary">Уровень 2 - Расширенная верификация</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Загрузка документа, удостоверяющего личность</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Подтверждение адреса проживания</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Селфи с документом для биометрической проверки</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Лимит операций: до $10,000 в день</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-icmop-background to-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-icmop-primary">Уровень 3 - Премиум верификация</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Видеозвонок с нашим специалистом</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Подтверждение источника доходов</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Расширенная проверка благонадежности</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-icmop-primary mr-2 mt-1">•</span>
                    <span>Лимит операций: без ограничений</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Мониторинг транзакций */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📊</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Мониторинг транзакций</h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Мы используем передовые системы автоматического мониторинга для выявления подозрительной активности:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-icmop-primary mr-3 mt-1">🤖</span>
                  <div>
                    <h4 className="font-semibold mb-1">Автоматическое сканирование</h4>
                    <p className="text-gray-600 text-sm">Все транзакции проверяются в режиме реального времени</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-icmop-primary mr-3 mt-1">📈</span>
                  <div>
                    <h4 className="font-semibold mb-1">Анализ паттернов</h4>
                    <p className="text-gray-600 text-sm">Выявление необычных схем и поведения</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-icmop-primary mr-3 mt-1">🔍</span>
                  <div>
                    <h4 className="font-semibold mb-1">Ручная проверка</h4>
                    <p className="text-gray-600 text-sm">Дополнительная экспертная оценка сложных случаев</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <span className="text-icmop-primary mr-3 mt-1">📋</span>
                  <div>
                    <h4 className="font-semibold mb-1">Отчетность</h4>
                    <p className="text-gray-600 text-sm">Своевременное уведомление регулирующих органов</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Запрещенная деятельность */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-red-500 text-3xl mr-3">⛔</span>
              <h2 className="text-2xl font-semibold text-red-600">Запрещенная деятельность</h2>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
              <p className="text-red-800 font-semibold mb-4">
                Использование нашего сервиса строго запрещено для следующих целей:
              </p>
              
              <ul className="space-y-2 text-red-700">
                <li className="flex items-start">
                  <span className="mr-2 mt-1">❌</span>
                  <span>Отмывание денег и финансирование терроризма</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">❌</span>
                  <span>Торговля наркотиками и другими запрещенными веществами</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">❌</span>
                  <span>Мошенничество и кража личных данных</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">❌</span>
                  <span>Нарушение санкционных режимов</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 mt-1">❌</span>
                  <span>Любая другая незаконная деятельность</span>
                </li>
              </ul>
            </div>

            <div className="bg-icmop-background rounded-lg p-6">
              <p className="text-gray-700">
                <strong>Важно:</strong> Нарушение данных правил приведет к немедленной блокировке аккаунта 
                и передаче информации в правоохранительные органы.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Защита данных */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🔐</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Защита персональных данных</h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Мы серьезно относимся к защите ваших персональных данных и соблюдаем все требования 
              международного законодательства о защите данных.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-icmop-background rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-icmop-primary">Шифрование данных</h4>
                <p className="text-gray-600 text-sm">
                  Все данные передаются и хранятся в зашифрованном виде с использованием 
                  современных криптографических алгоритмов.
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-icmop-primary">Ограниченный доступ</h4>
                <p className="text-gray-600 text-sm">
                  Доступ к персональным данным имеют только уполномоченные сотрудники 
                  в рамках выполнения служебных обязанностей.
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-icmop-primary">Срок хранения</h4>
                <p className="text-gray-600 text-sm">
                  Данные хранятся только в течение необходимого периода в соответствии 
                  с требованиями законодательства.
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-icmop-primary">Право на удаление</h4>
                <p className="text-gray-600 text-sm">
                  Вы имеете право запросить удаление ваших данных в соответствии 
                  с применимым законодательством.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Контакты для вопросов */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📞</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Вопросы по AML/KYC</h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Если у вас есть вопросы по нашей политике AML/KYC или процедурам верификации, 
              обращайтесь к нашим специалистам:
            </p>

            <div className="bg-icmop-background rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <span className="text-icmop-primary text-xl mr-3">✉️</span>
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-600">compliance@icambio.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <span className="text-icmop-primary text-xl mr-3">🕒</span>
                  <div>
                    <p className="font-semibold">Время ответа</p>
                    <p className="text-gray-600">В течение 24 часов</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};