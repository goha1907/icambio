import { Card, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';

export const AboutPage = () => {
  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto space-y-8">
        <PageTitle 
          title="О нас" 
          description="Узнайте больше о компании iCambio - надежном партнере в мире валютных операций" 
        />

        {/* Основная информация */}
        <Card>
          <CardContent className="prose max-w-none p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">🏢</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">iCambio - Ваш надежный обменник</h2>
            </div>
            
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              iCambio — это современный сервис обмена валют, который работает на рынке с 2020 года. 
              Мы специализируемся на безопасном и выгодном обмене криптовалют и фиатных денег, 
              предоставляя нашим клиентам лучшие курсы и высокий уровень сервиса.
            </p>

            <p className="text-gray-600 text-lg leading-relaxed">
              За годы работы мы обработали более 50,000 операций на общую сумму свыше $10 миллионов, 
              заслужив доверие тысяч клиентов по всему миру.
            </p>
          </CardContent>
        </Card>

        {/* Наши преимущества */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">⭐</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Наши преимущества</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-2xl mr-2">🔒</span>
                  <h3 className="text-lg font-semibold">Безопасность</h3>
                </div>
                <p className="text-gray-600">
                  Все операции проходят с соблюдением высоких стандартов безопасности. 
                  Мы используем многоуровневую систему защиты данных.
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-2xl mr-2">💰</span>
                  <h3 className="text-lg font-semibold">Выгодные курсы</h3>
                </div>
                <p className="text-gray-600">
                  Мы предлагаем одни из лучших курсов на рынке благодаря прямым 
                  партнерским отношениям с ведущими биржами.
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-2xl mr-2">⚡</span>
                  <h3 className="text-lg font-semibold">Быстрые операции</h3>
                </div>
                <p className="text-gray-600">
                  Большинство операций обрабатываются в течение 15-30 минут. 
                  Мы ценим ваше время!
                </p>
              </div>

              <div className="bg-icmop-background rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <span className="text-icmop-primary text-2xl mr-2">🎯</span>
                  <h3 className="text-lg font-semibold">Персональный подход</h3>
                </div>
                <p className="text-gray-600">
                  Каждый клиент получает индивидуальное внимание и поддержку 
                  на всех этапах сделки.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Наша команда */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">👥</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Наша команда</h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              В iCambio работают опытные специалисты в области финансов и криптовалют. 
              Наша команда состоит из профессионалов с многолетним опытом работы в банковской 
              сфере и на криптовалютных рынках.
            </p>

            <div className="bg-icmop-background rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-icmop-primary">Ключевые принципы нашей работы:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-icmop-primary mr-2 mt-1">✓</span>
                  <span>Прозрачность всех операций и честное ценообразование</span>
                </li>
                <li className="flex items-start">
                  <span className="text-icmop-primary mr-2 mt-1">✓</span>
                  <span>Соблюдение всех требований законодательства и AML/KYC политик</span>
                </li>
                <li className="flex items-start">
                  <span className="text-icmop-primary mr-2 mt-1">✓</span>
                  <span>Постоянное развитие и внедрение новых технологий</span>
                </li>
                <li className="flex items-start">
                  <span className="text-icmop-primary mr-2 mt-1">✓</span>
                  <span>Круглосуточная поддержка клиентов</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Лицензии и сертификаты */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📜</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Лицензии и регулирование</h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              iCambio работает в полном соответствии с требованиями международного 
              законодательства в области финансовых услуг и противодействия отмыванию денег.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-icmop-background to-white rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-icmop-primary">Сертификация</h3>
                <p className="text-gray-600">
                  Наш сервис сертифицирован по международным стандартам безопасности 
                  и соответствует требованиям PCI DSS.
                </p>
              </div>

              <div className="bg-gradient-to-r from-icmop-background to-white rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2 text-icmop-primary">Страхование</h3>
                <p className="text-gray-600">
                  Все операции застрахованы ведущими страховыми компаниями 
                  на сумму до $1,000,000.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Контактная информация */}
        <Card>
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-6">
              <span className="text-icmop-primary text-3xl mr-3">📞</span>
              <h2 className="text-2xl font-semibold text-icmop-primary">Свяжитесь с нами</h2>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              У вас есть вопросы? Мы всегда готовы помочь! Свяжитесь с нами любым удобным способом.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-icmop-background rounded-lg">
                <span className="text-icmop-primary text-2xl block mb-2">✉️</span>
                <p className="font-semibold">Email</p>
                <p className="text-gray-600">support@icambio.com</p>
              </div>

              <div className="text-center p-4 bg-icmop-background rounded-lg">
                <span className="text-icmop-primary text-2xl block mb-2">📱</span>
                <p className="font-semibold">WhatsApp</p>
                <p className="text-gray-600">+7 (999) 123-45-67</p>
              </div>

              <div className="text-center p-4 bg-icmop-background rounded-lg">
                <span className="text-icmop-primary text-2xl block mb-2">✈️</span>
                <p className="font-semibold">Telegram</p>
                <p className="text-gray-600">@icambio_support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
