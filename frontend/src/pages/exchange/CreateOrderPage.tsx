import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  ArrowLeft,
  CheckCircle,
  Info,
  MapPin,
  MessageCircle,
  Phone,
  Shield,
  Clock,
  AlertTriangle,
  Copy,
  Eye,
  FileText,
  Truck,
  Calculator,
  Star
} from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { Textarea } from '@/shared/ui/Textarea';
import { Label } from '@/shared/ui/Label';
import { Badge } from '@/shared/ui/Badge';
import { exchangeOrderSchema } from '@/shared/validation/exchange';
import { useAuth } from '@/features/auth/hooks/useAuth';
import toast from 'react-hot-toast';

// Тип для данных формы этого шага
type ContactDetailsFormData = Omit<z.infer<typeof exchangeOrderSchema>, 'exchangePairs' | 'totalFromAmount'>;

// Валидируем только часть общей схемы
const step2Schema = exchangeOrderSchema.innerType().innerType().pick({
    whatsapp: true,
    telegram: true,
    delivery: true,
    address: true,
    comment: true,
});

/**
 * Страница создания заявки на обмен (Шаг 2)
 * 
 * Отвечает за:
 * - Сбор контактной информации пользователя
 * - Настройку параметров доставки
 * - Отображение детального обзора заказа
 * - Финальное создание заявки
 * - Информацию о процессе и безопасности
 */
export const CreateOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(true);

  // Автоподстановка данных для авторизованных пользователей
  const getDefaultValues = () => {
    if (isAuthenticated && user) {
      return {
        delivery: !!user.preferred_delivery_address,
        whatsapp: user.whatsapp || '',
        telegram: user.telegram || '',
        address: user.preferred_delivery_address || '',
        comment: '',
      };
    }
    return { 
      delivery: false, 
      whatsapp: '', 
      telegram: '', 
      address: '', 
      comment: '' 
    };
  };

  const form = useForm<ContactDetailsFormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: getDefaultValues(),
  });

  const { register, handleSubmit, formState: { errors }, watch } = form;
  const delivery = watch('delivery');

  if (!orderData || !orderData.pairs || orderData.pairs.length === 0) {
    return <Navigate to="/exchange" replace />;
  }

  // Вычисляем общую сумму и комиссии
  const totalFromAmount = orderData.pairs.reduce((acc: number, p: any) => acc + p.amount, 0);
  const estimatedFee = totalFromAmount * 0.015; // 1.5% комиссия
  const estimatedTotal = totalFromAmount - estimatedFee;

  const onSubmit = async (contactData: ContactDetailsFormData) => {
    setIsSubmitting(true);
    
    try {
    const finalOrder = {
      exchangePairs: orderData.pairs,
        totalFromAmount,
      ...contactData,
    };
      
      // Имитируем создание заказа
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Генерируем новый ID заказа
      const newOrderId = `ORD-${String(Date.now()).slice(-6)}`;
    console.log('Final Order Payload:', finalOrder);
      
      toast.success('Заявка успешно создана!');
      
      // Перенаправляем на страницу созданного заказа
      navigate(`/order/${newOrderId}`, { 
        state: { orderData: finalOrder } 
      });
    } catch (error) {
      toast.error('Ошибка при создании заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              onClick={() => navigate(-1)}
              className="text-green-600 hover:bg-green-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Создание заявки</h1>
              <p className="text-muted-foreground">Шаг 2 из 2: Контактная информация и детали</p>
            </div>
          </div>

          {/* Прогресс */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                ✓
              </div>
              <span className="text-sm font-medium text-green-600">Выбор валют</span>
            </div>
            <div className="flex-1 h-0.5 bg-green-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium text-green-600">Контактные данные</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Левая колонка - Основная форма */}
          <div className="lg:col-span-2 space-y-6">
            {/* Информационное сообщение для авторизованных пользователей */}
            {isAuthenticated && user && (user.whatsapp || user.telegram || user.preferred_delivery_address) && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                      <p className="text-sm font-medium text-green-800 mb-1">
                        Автозаполнение данных
                      </p>
                      <p className="text-sm text-green-700">
                        Мы автоматически заполнили форму вашими данными из профиля. 
                        Вы можете изменить их при необходимости.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Контактная информация */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span>Контактная информация</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Укажите способы связи для координации обмена
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="whatsapp" className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span>WhatsApp</span>
                      <Badge variant="outline" className="text-xs">Рекомендуется</Badge>
                    </Label>
                    <Input 
                      id="whatsapp" 
                      placeholder="+7 (999) 123-45-67"
                      {...register('whatsapp')} 
                      aria-invalid={!!errors.whatsapp}
                      className={errors.whatsapp ? 'border-red-500' : ''}
                    />
                    {errors.whatsapp && (
                      <p className="text-red-500 text-sm mt-1">{errors.whatsapp.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Основной способ связи для быстрого решения вопросов
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="telegram" className="flex items-center space-x-2">
                      <MessageCircle className="w-4 h-4 text-blue-600" />
                      <span>Telegram</span>
                      <Badge variant="outline" className="text-xs">Опционально</Badge>
                    </Label>
                    <Input 
                      id="telegram" 
                      placeholder="@username или ссылка"
                      {...register('telegram')} 
                      aria-invalid={!!errors.telegram}
                      className={errors.telegram ? 'border-red-500' : ''}
                    />
                    {errors.telegram && (
                      <p className="text-red-500 text-sm mt-1">{errors.telegram.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Альтернативный способ связи
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Доставка */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span>Параметры доставки</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Настройте способ получения обмененных средств
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <input 
                      type="checkbox" 
                      id="delivery" 
                      {...register('delivery')} 
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-2 mt-0.5" 
                    />
                    <div>
                      <Label htmlFor="delivery" className="text-sm font-medium text-blue-800">
                        Нужна доставка?
                      </Label>
                      <p className="text-xs text-blue-600 mt-1">
                        Мы можем доставить наличные по указанному адресу
                      </p>
                    </div>
                  </div>

                  {delivery && (
                    <div className="space-y-3 p-4 bg-gray-50 rounded-lg border">
                      <Label htmlFor="address" className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-orange-600" />
                        <span>Адрес доставки</span>
                      </Label>
                      <Textarea 
                        id="address" 
                        placeholder="Укажите полный адрес доставки с указанием времени и особых пожеланий..."
                        {...register('address')} 
                        aria-invalid={!!errors.address}
                        className={errors.address ? 'border-red-500' : ''}
                        rows={3}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                      )}
                      <div className="bg-amber-50 border border-amber-200 rounded p-3">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                          <div className="text-xs text-amber-700">
                            <p className="font-medium mb-1">Важная информация о доставке:</p>
                            <ul className="space-y-1">
                              <li>• Доставка осуществляется в течение 2-4 часов</li>
                              <li>• Дополнительная комиссия: 3% от суммы</li>
                              <li>• Минимальная сумма для доставки: $100</li>
                            </ul>
                          </div>
                        </div>
                      </div>
              </div>
            )}
          </CardContent>
        </Card>

              {/* Дополнительная информация */}
        <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    <span>Дополнительная информация</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Укажите особые пожелания или инструкции
                  </p>
                </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="comment">Комментарий к заказу</Label>
                    <Textarea 
                      id="comment" 
                      placeholder="Дополнительные пожелания, инструкции или вопросы..."
                      {...register('comment')} 
                      aria-invalid={!!errors.comment}
                      className={errors.comment ? 'border-red-500' : ''}
                      rows={4}
                    />
                    {errors.comment && (
                      <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Максимум 500 символов. Поможет нам лучше обслужить ваш заказ.
                    </p>
            </div>
          </CardContent>
        </Card>

              {/* Кнопка отправки */}
        <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Создание заявки...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Создать заявку
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Правая колонка - Обзор заказа и дополнительная информация */}
          <div className="space-y-6">
            {/* Обзор заказа */}
            <Card className="sticky top-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span>Обзор заказа</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowOrderDetails(!showOrderDetails)}
                  >
                    {showOrderDetails ? 'Скрыть' : 'Показать'}
                  </Button>
                </div>
              </CardHeader>
              
              {showOrderDetails && (
                <CardContent className="space-y-4">
                  {/* Валютные пары */}
                  <div className="space-y-3">
                    {orderData.pairs.map((pair: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {pair.fromCurrency} → {pair.toCurrency}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            Курс: {pair.rate}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex justify-between">
                            <span>Отдаете:</span>
                            <span className="font-medium">{pair.amount} {pair.fromCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Получаете:</span>
                            <span className="font-medium text-green-600">
                              {(pair.amount * pair.rate).toFixed(2)} {pair.toCurrency}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Итоговые суммы */}
                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Общая сумма:</span>
                      <span className="font-medium">${totalFromAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Комиссия (1.5%):</span>
                      <span>-${estimatedFee.toFixed(2)}</span>
                    </div>
                    {delivery && (
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Доставка (3%):</span>
                        <span>-${(totalFromAmount * 0.03).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-medium pt-2 border-t">
                      <span>К получению:</span>
                      <span className="text-green-600">
                        ${(estimatedTotal - (delivery ? totalFromAmount * 0.03 : 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Время обработки */}
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Время обработки</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Обычно 15-30 минут в рабочее время
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Безопасность */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Безопасность</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">SSL шифрование</p>
                    <p className="text-xs text-muted-foreground">Ваши данные защищены</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Лицензированная деятельность</p>
                    <p className="text-xs text-muted-foreground">Работаем официально</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Гарантия возврата</p>
                    <p className="text-xs text-muted-foreground">100% гарантия сделки</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Поддержка */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Нужна помощь?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard('+7 999 123-45-67')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +7 999 123-45-67
                  <Copy className="w-3 h-3 ml-auto" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard('@icambio_support')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  @icambio_support
                  <Copy className="w-3 h-3 ml-auto" />
                </Button>
              </CardContent>
            </Card>

            {/* Преимущества сервиса */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>Почему выбирают нас?</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Calculator className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Выгодные курсы</p>
                    <p className="text-xs text-muted-foreground">Лучше банковских на 2-5%</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Быстрая обработка</p>
                    <p className="text-xs text-muted-foreground">От 15 минут до 2 часов</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <Shield className="w-3 h-3 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Полная безопасность</p>
                    <p className="text-xs text-muted-foreground">5 лет без инцидентов</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}; 