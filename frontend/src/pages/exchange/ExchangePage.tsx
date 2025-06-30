import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  PlusCircle, 
  ArrowRight, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  Star,
  Calculator,
  Zap,
  Globe,
  CheckCircle,
  Info,
  BarChart3,
  DollarSign,
  Percent,
  Phone,
  MessageCircle,
  Copy,
  Eye,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { CurrencyPairForm } from '@/features/exchange/components/CurrencyPairForm';
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';
import toast from 'react-hot-toast';

const exchangeFormSchema = z.object({
  pairs: z.array(
    z.object({
      fromCurrency: z.string().min(1, "Выберите валюту отправления"),
      toCurrency: z.string().min(1, "Выберите валюту получения"),
      amount: z.number(),
      result: z.number(),
    })
    .refine((data) => data.fromCurrency !== data.toCurrency, {
      message: "Выберите разные валюты для обмена",
      path: ["toCurrency"],
    })
  ).min(1, "Добавьте хотя бы одну валютную пару"),
});

type ExchangeFormData = z.infer<typeof exchangeFormSchema>;

/**
 * Страница обмена валют (Шаг 1)
 * 
 * Отвечает за:
 * - Создание и управление валютными парами
 * - Отображение актуальных курсов
 * - Предварительный расчет обмена
 * - Навигацию к следующему шагу
 */
export function ExchangePage() {
  const navigate = useNavigate();
  const [showRatesTable, setShowRatesTable] = useState(false);

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeFormSchema),
    defaultValues: {
      pairs: [{ fromCurrency: '', toCurrency: '', amount: 0, result: 0 }],
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pairs',
  });

  const onSubmit = (data: ExchangeFormData) => {
    console.log('Step 1 data:', data);
    navigate(`/exchange/details`, { state: { orderData: data } });
  };

  // Вычисляем общую сумму всех валютных пар
  const totalAmount = form.watch('pairs').reduce((acc, pair) => acc + (pair.amount || 0), 0);
  const hasValidPairs = form.watch('pairs').some(pair => 
    pair.fromCurrency && pair.toCurrency && pair.amount > 0
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Шапка с навигацией */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-green-600 hover:bg-green-100"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
              На главную
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Создание заявки</h1>
              <p className="text-muted-foreground">Шаг 1 из 2: Выбор валютных пар</p>
            </div>
          </div>

          {/* Прогресс */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-green-600">Выбор валют</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium text-gray-500">Контактные данные</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Основная форма */}
          <div className="lg:col-span-2 space-y-6">
            {/* Информационное сообщение */}
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Добро пожаловать в iCambio
                    </p>
                    <p className="text-sm text-green-700">
                      Создайте одну или несколько валютных пар для обмена. 
                      Курсы обновляются в режиме реального времени.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Карточка с формой */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Calculator className="w-5 h-5 text-green-600" />
                          <span>Калькулятор обмена</span>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Добавьте валютные пары и укажите суммы для обмена
                        </p>
                      </div>
                      {hasValidPairs && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Общая сумма: ${totalAmount.toLocaleString()}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Валютные пары */}
                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="relative">
                          {index > 0 && (
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs px-2 py-1">
                                Пара {index + 1}
                              </Badge>
                            </div>
                          )}
                          <CurrencyPairForm
                            key={field.id}
                            index={index}
                            isRemovable={fields.length > 1}
                            onRemove={() => remove(index)}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ fromCurrency: '', toCurrency: '', amount: 0, result: 0 })}
                        className="flex items-center gap-2 w-full sm:w-auto"
                        disabled={fields.length >= 5}
                      >
                        <PlusCircle className="w-4 h-4" />
                        Добавить валютную пару
                        {fields.length >= 5 && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            Макс. 5
                          </Badge>
                        )}
                      </Button>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowRatesTable(!showRatesTable)}
                          className="flex items-center gap-2"
                        >
                          <BarChart3 className="w-4 h-4" />
                          Курсы валют
                          {showRatesTable ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>

                        <Button
                          type="submit"
                          disabled={!hasValidPairs}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                        >
                          Продолжить
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Таблица курсов */}
                {showRatesTable && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        <span>Актуальные курсы валют</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Курсы обновляются каждые 30 секунд
                      </p>
                    </CardHeader>
                    <CardContent>
                      <ExchangeRatesTable />
                    </CardContent>
                  </Card>
                )}
              </form>
            </FormProvider>
          </div>

          {/* Правая колонка - Информация */}
          <div className="space-y-6">
            {/* Преимущества сервиса */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Преимущества iCambio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Выгодные курсы</p>
                    <p className="text-xs text-muted-foreground">
                      Лучшие курсы на рынке без скрытых комиссий
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Быстрые операции</p>
                    <p className="text-xs text-muted-foreground">
                      Обработка заявок в течение 15-30 минут
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Полная безопасность</p>
                    <p className="text-xs text-muted-foreground">
                      Защищенные транзакции и конфиденциальность
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Globe className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">50+ валют</p>
                    <p className="text-xs text-muted-foreground">
                      Широкий выбор криптовалют и фиатных валют
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Процесс обмена */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Как это работает</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Выберите валюты</p>
                    <p className="text-xs text-muted-foreground">
                      Укажите, что отдаете и что хотите получить
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Укажите контакты</p>
                    <p className="text-xs text-muted-foreground">
                      Оставьте данные для связи
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs font-medium flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-500">Получите средства</p>
                    <p className="text-xs text-muted-foreground">
                      Заберите готовые средства или получите доставку
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Гарантии безопасности */}
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Гарантии безопасности</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">Лицензия ЦБ РФ</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">SSL шифрование</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">Страхование сделок</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">5 лет без инцидентов</span>
                </div>
              </CardContent>
            </Card>

            {/* Поддержка 24/7 */}
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardHeader>
                <CardTitle className="text-white text-sm">Поддержка 24/7</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-blue-100">
                  Наши специалисты готовы помочь на любом этапе обмена
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => copyToClipboard('+7 999 123-45-67')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +7 999 123-45-67
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => copyToClipboard('@icambio_support')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  @icambio_support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 