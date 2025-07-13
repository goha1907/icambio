import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { 
  ArrowRight,
  Star,
  Shield,
  Clock,
  DollarSign,
  Users,
  Zap,
  Globe,
  TrendingUp,
  Award,
  Phone,
  MessageCircle,
  Copy,
  Calculator,
} from 'lucide-react';

import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import { ReviewsCarousel } from '@/features/reviews/components/ReviewsCarousel';
import { CurrencyExchangeForm } from '@/features/exchange/components/CurrencyExchangeForm';
import { QuickPairFilters } from '@/features/exchange/components/QuickPairFilters';
import toast from 'react-hot-toast';

interface HomeFormData {
  pairs: Array<{
    fromCurrency: string;
    toCurrency: string;
    amount: number;
    result: number;
  }>;
}

/**
 * Главная страница приложения iCambio
 * 
 * Отвечает за:
 * - Презентацию сервиса и его преимуществ
 * - Hero-секцию с основным призывом к действию
 * - Статистику и социальные доказательства
 * - Быстрый калькулятор обмена
 * - Отзывы клиентов
 * - Информацию о работе сервиса
 */
export const HomePage = () => {
  const navigate = useNavigate();
  
  const form = useForm<HomeFormData>({
    defaultValues: { 
      pairs: [{
        fromCurrency: 'USD',
        toCurrency: 'RUB',
        amount: 0,
        result: 0,
      }] 
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const handleFilterSelect = (fromCurrency: string, toCurrency: string) => {
    form.setValue('pairs.0.fromCurrency', fromCurrency);
    form.setValue('pairs.0.toCurrency', toCurrency);
  };

  const handleOrderSubmit = () => {
    const formData = form.getValues();
    navigate('/exchange', { 
      state: { 
        initialData: formData.pairs[0] 
      } 
    });
  };

  // Проверяем, можно ли активировать кнопку заказа
  const canSubmitOrder = () => {
    const formData = form.getValues();
    const pair = formData.pairs[0];
    return pair.fromCurrency && pair.toCurrency && pair.amount > 0;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - уменьшенный */}
      <section className="relative bg-gradient-to-br from-blue-600 via-green-600 to-emerald-600 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30 mb-4">
                🚀 Лучший сервис обмена валют
              </Badge>
              
              <h1 className="text-3xl lg:text-5xl font-bold mb-4 leading-tight">
                Обмен валют
                <span className="block text-yellow-300">быстро и выгодно</span>
              </h1>
              
              <p className="text-lg lg:text-xl text-blue-100 mb-6 leading-relaxed">
                Более 50 валют, выгодные курсы и обработка заявок за 15 минут. 
                Доверие 15,000+ клиентов по всему миру.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button 
                  size="lg"
                  className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4 font-semibold"
                  onClick={() => navigate('/exchange')}
                >
                  Начать обмен
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white text-lg px-8 py-4"
                >
                  <Calculator className="w-5 h-5 mr-2" />
                  Калькулятор обмена
                </Button>
      </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl lg:text-2xl font-bold">15K+</div>
                  <div className="text-xs text-blue-200">Клиентов</div>
      </div>
                <div>
                  <div className="text-xl lg:text-2xl font-bold">$50M+</div>
                  <div className="text-xs text-blue-200">Обменяно</div>
      </div>
          <div>
                  <div className="text-xl lg:text-2xl font-bold">4.9</div>
                  <div className="text-xs text-blue-200">Рейтинг</div>
                </div>
              </div>
            </div>

            {/* Right Content - Features Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <DollarSign className="w-6 h-6 text-yellow-300 mb-3" />
                  <h3 className="font-semibold text-base mb-1">Выгодные курсы</h3>
                  <p className="text-xs text-blue-100">На 2-5% лучше банковских</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <Zap className="w-6 h-6 text-yellow-300 mb-3" />
                  <h3 className="font-semibold text-base mb-1">Быстро</h3>
                  <p className="text-xs text-blue-100">Обработка за 15-30 минут</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <Shield className="w-6 h-6 text-yellow-300 mb-3" />
                  <h3 className="font-semibold text-base mb-1">Безопасно</h3>
                  <p className="text-xs text-blue-100">Лицензия и SSL защита</p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-4">
                  <Globe className="w-6 h-6 text-yellow-300 mb-3" />
                  <h3 className="font-semibold text-base mb-1">50+ валют</h3>
                  <p className="text-xs text-blue-100">Крипто и фиатные валюты</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Calculator Section - всегда показываем */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="w-6 h-6 text-green-600" />
                <span>Калькулятор обмена</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FormProvider {...form}>
                <QuickPairFilters onFilterSelect={handleFilterSelect} />
                <CurrencyExchangeForm index={0} />
                <div className="mt-6 flex justify-center">
                  <Button 
                    size="lg"
                    onClick={handleOrderSubmit}
                    disabled={!canSubmitOrder()}
                    className={`px-8 py-3 ${
                      canSubmitOrder() 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Заказать обмен
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </FormProvider>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Exchange Rates Section - всегда показываем */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
              Актуальные курсы валют
            </h2>
            <p className="text-lg text-muted-foreground">
              Курсы обновляются в режиме реального времени
            </p>
          </div>

          <Card className="max-w-6xl mx-auto">
            <CardContent className="p-6">
              <ExchangeRatesTable />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Нам доверяют тысячи клиентов
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Статистика работы за последние 12 месяцев
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">15,247</div>
              <div className="text-muted-foreground">Довольных клиентов</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">$52.8M</div>
              <div className="text-muted-foreground">Обменено средств</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">4.9</div>
              <div className="text-muted-foreground">Средний рейтинг</div>
      </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold text-foreground mb-2">18 мин</div>
              <div className="text-muted-foreground">Среднее время</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Почему выбирают iCambio?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Мы предоставляем лучший сервис обмена валют на рынке
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Лучшие курсы</h3>
                <p className="text-muted-foreground">
                  Курсы на 2-5% выгоднее банковских. Никаких скрытых комиссий и доплат.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Молниеносно</h3>
                <p className="text-muted-foreground">
                  Обработка заявок за 15-30 минут. Самый быстрый сервис на рынке.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Безопасность</h3>
                <p className="text-muted-foreground">
                  Лицензия ЦБ РФ, SSL шифрование и страхование всех операций.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">50+ валют</h3>
                <p className="text-muted-foreground">
                  Широкий выбор криптовалют и фиатных валют для любых нужд.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Опыт</h3>
                <p className="text-muted-foreground">
                  5 лет на рынке, 15K+ довольных клиентов и ни одного инцидента.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Phone className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Поддержка 24/7</h3>
                <p className="text-muted-foreground">
                  Наши специалисты всегда готовы помочь в любое время.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Отзывы наших клиентов
            </h2>
            <p className="text-xl text-muted-foreground">
              Узнайте, что говорят о нас наши клиенты
            </p>
          </div>

          <ReviewsCarousel />
        </div>
      </section>

      {/* Contact Section - уменьшенный */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-3">
              Остались вопросы?
            </h2>
            <p className="text-lg text-green-100">
              Наши специалисты готовы помочь 24/7
            </p>
      </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <Phone className="w-8 h-8 text-green-300 mx-auto mb-3" />
                <h3 className="font-semibold text-base mb-2">Телефон</h3>
                <p className="text-green-100 mb-3 text-sm">Звоните в любое время</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => copyToClipboard('+7 999 123-45-67')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  +7 999 123-45-67
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="p-4 text-center">
                <MessageCircle className="w-8 h-8 text-blue-300 mx-auto mb-3" />
                <h3 className="font-semibold text-base mb-2">Telegram</h3>
                <p className="text-blue-100 mb-3 text-sm">Быстрые ответы в мессенджере</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                  onClick={() => copyToClipboard('@icambio_support')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  @icambio_support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section - уменьшенный */}
      <section className="bg-gradient-to-br from-gray-50 to-green-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3">
            Готовы начать обмен?
          </h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
            Создайте заявку прямо сейчас и получите лучший курс для вашего обмена
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4"
          onClick={() => navigate('/exchange')}
        >
              Создать заявку
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8 py-4"
            >
              Рассчитать курс
              <Calculator className="w-5 h-5 ml-2" />
        </Button>
      </div>

          <div className="mt-6 text-sm text-muted-foreground">
            Присоединяйтесь к 15,000+ довольных клиентов
          </div>
        </div>
      </section>
    </div>
  );
};
