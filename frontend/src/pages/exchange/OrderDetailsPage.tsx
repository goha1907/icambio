import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Star, 
  Copy, 
  Phone, 
  MessageCircle, 
  MapPin,
  AlertCircle,
  FileText,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  User,
  CreditCard,
  Package,
  Truck,
  Eye,
  Download,
  Share2,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Badge } from '@/shared/ui/Badge';
import { Textarea } from '@/shared/ui/Textarea';
import { Label } from '@/shared/ui/Label';
import { cn } from '@/lib/utils';
import { MOCK_EXCHANGE_HISTORY } from '@/lib/mock-data';

// Схема валидации отзыва
const reviewSchema = z.object({
  rating: z.number().min(1, 'Пожалуйста, поставьте оценку').max(5),
  comment: z.string()
    .min(10, 'Отзыв должен содержать минимум 10 символов')
    .max(500, 'Отзыв не должен превышать 500 символов'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

// Конфигурация статусов заказа
const statusConfig = {
  pending: {
    icon: Clock,
    text: 'В обработке',
    description: 'Ваша заявка принята и обрабатывается нашими специалистами',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    progress: 25,
  },
  processing: {
    icon: RefreshCw,
    text: 'Обработка',
    description: 'Проверяем курсы и подготавливаем валюту для обмена',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    progress: 50,
  },
  ready: {
    icon: Package,
    text: 'Готов к выдаче',
    description: 'Валюта готова к получению, ожидаем вашего прибытия',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    progress: 75,
  },
  completed: {
    icon: CheckCircle,
    text: 'Выполнен',
    description: 'Обмен успешно завершен, спасибо за использование нашего сервиса!',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    progress: 100,
  },
  cancelled: {
    icon: XCircle,
    text: 'Отменен',
    description: 'Заявка была отменена по вашему запросу или по техническим причинам',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    progress: 0,
  },
};

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Получаем данные заказа из location.state или ищем в mock данных
  let order = location.state?.orderData || MOCK_EXCHANGE_HISTORY.find(o => o.id === orderId);
  
  // Если заказ не найден, создаем демонстрационный заказ
  if (!order && orderId?.startsWith('ORD-')) {
    order = {
      id: orderId,
      date: new Date().toISOString(),
      fromCurrency: 'USDT',
      toCurrency: 'RUB',
      fromAmount: 1000,
      toAmount: 95000,
      status: 'pending' as const,
      hasReview: false,
      pairs: [
        {
          fromCurrency: 'USDT',
          toCurrency: 'RUB',
          amount: 1000,
          result: 95000,
          rate: 95
        }
      ],
      contactInfo: {
        whatsapp: '+7 999 123-45-67',
        telegram: '@user_telegram',
        delivery: true,
        address: 'г. Москва, ул. Примерная, д. 123, кв. 45'
      },
      fees: {
        exchange: 15, // 1.5%
        delivery: 30  // 3%
      }
    };
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  useEffect(() => {
    setValue('rating', rating);
  }, [rating, setValue]);

  // Загружаем существующий отзыв при открытии страницы
  useEffect(() => {
    if (order?.hasReview && orderId) {
      const existingReviews = JSON.parse(localStorage.getItem('orderReviews') || '[]');
      const existingReview = existingReviews.find((r: any) => r.orderId === orderId);
      
      if (existingReview) {
        setRating(existingReview.rating);
        setValue('rating', existingReview.rating);
        setValue('comment', existingReview.comment);
      }
    }
  }, [order?.hasReview, orderId, setValue]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Заказ не найден</h2>
              <p className="text-gray-500 mb-6">Заказ с ID {orderId} не найден в системе</p>
              <Button
                onClick={() => navigate('/profile')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Вернуться к профилю
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  const onSubmitReview = async (data: ReviewFormData) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(order.hasReview ? 'Отзыв обновлен!' : 'Отзыв отправлен!');
      
      // Сохраняем данные отзыва в localStorage
      const reviewData = {
        orderId: orderId,
        rating: data.rating,
        comment: data.comment,
        date: new Date().toISOString(),
      };
      
      const existingReviews = JSON.parse(localStorage.getItem('orderReviews') || '[]');
      const existingReviewIndex = existingReviews.findIndex((r: any) => r.orderId === orderId);
      
      if (existingReviewIndex !== -1) {
        existingReviews[existingReviewIndex] = reviewData;
      } else {
        existingReviews.push(reviewData);
      }
      
      localStorage.setItem('orderReviews', JSON.stringify(existingReviews));
      
      // Обновляем статус отзыва
      order.hasReview = true;
      
    } catch (error) {
      toast.error('Ошибка при отправке отзыва');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Скопировано в буфер обмена');
  };

  const shareOrder = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Заказ #${order.id}`,
        text: 'Заказ на обмен валют в iCambio',
        url: url,
      });
    } else {
      copyToClipboard(url);
    }
  };

  // Вычисляем общие суммы
  const totalFromAmount = order.pairs?.reduce((acc: number, pair: any) => acc + pair.amount, 0) || order.fromAmount;
  const totalToAmount = order.pairs?.reduce((acc: number, pair: any) => acc + pair.result, 0) || order.toAmount;
  const totalFees = (order.fees?.exchange || 0) + (order.fees?.delivery || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Шапка */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-blue-600 hover:bg-blue-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={shareOrder}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Поделиться
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Печать
              </Button>
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Заказ #{order.id}
            </h1>
            <p className="text-muted-foreground">
              Создан {new Date(order.date).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Основная информация */}
          <div className="xl:col-span-2 space-y-6">
            {/* Статус и прогресс */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <StatusIcon className={cn("w-6 h-6", status.color)} />
                  <span>Статус заказа</span>
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-xs font-medium",
                      status.color,
                      status.bgColor,
                      status.borderColor
                    )}
                  >
                    {status.text}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{status.description}</p>
                
                {/* Прогресс бар */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Прогресс выполнения</span>
                    <span className="font-medium">{status.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full transition-all duration-500",
                        order.status === 'completed' ? 'bg-green-600' :
                        order.status === 'cancelled' ? 'bg-red-600' :
                        'bg-blue-600'
                      )}
                      style={{ width: `${status.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Этапы выполнения */}
                <div className="grid grid-cols-4 gap-2 mt-6">
                  {[
                    { key: 'pending', label: 'Принят', icon: Clock },
                    { key: 'processing', label: 'Обработка', icon: RefreshCw },
                    { key: 'ready', label: 'Готов', icon: Package },
                    { key: 'completed', label: 'Выполнен', icon: CheckCircle }
                  ].map((step, index) => {
                    const isActive = status.progress > index * 25;
                    const isCurrent = status.progress === (index + 1) * 25;
                    const StepIcon = step.icon;
                    
                    return (
                      <div key={step.key} className="text-center">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 transition-colors",
                          isActive ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400",
                          isCurrent && "ring-2 ring-blue-300"
                        )}>
                          <StepIcon className="w-4 h-4" />
                        </div>
                        <span className={cn(
                          "text-xs",
                          isActive ? "text-blue-600 font-medium" : "text-gray-400"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Детали обмена */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span>Детали обмена</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Валютные пары */}
                <div className="space-y-3">
                  {order.pairs?.map((pair: any, index: number) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-sm">
                          Пара {index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Курс: {pair.rate || (pair.result / pair.amount).toFixed(2)}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Отдаете</div>
                          <div className="font-medium">
                            {pair.amount.toLocaleString()} {pair.fromCurrency}
                          </div>
                        </div>
                        
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Получаете</div>
                          <div className="font-medium text-green-600">
                            {pair.result.toLocaleString()} {pair.toCurrency}
                          </div>
                        </div>
                      </div>
                    </div>
                  )) || (
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Отдаете</div>
                          <div className="font-medium">
                            {order.fromAmount.toLocaleString()} {order.fromCurrency}
                          </div>
                        </div>
                        
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground mb-1">Получаете</div>
                          <div className="font-medium text-green-600">
                            {order.toAmount.toLocaleString()} {order.toCurrency}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Финансовая сводка */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Сумма обмена:</span>
                    <span className="font-medium">${totalFromAmount.toLocaleString()}</span>
                  </div>
                  {order.fees?.exchange && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Комиссия за обмен:</span>
                      <span>-${order.fees.exchange}</span>
                    </div>
                  )}
                  {order.fees?.delivery && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Комиссия за доставку:</span>
                      <span>-${order.fees.delivery}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-medium pt-2 border-t">
                    <span>Итого к получению:</span>
                    <span className="text-green-600">
                      ${(totalFromAmount - totalFees).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Контактная информация */}
            {order.contactInfo && (
              <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <span>Контактная информация</span>
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowContactInfo(!showContactInfo)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {showContactInfo ? 'Скрыть' : 'Показать'}
                    </Button>
                  </div>
                </CardHeader>
                {showContactInfo && (
                  <CardContent className="space-y-3">
                    {order.contactInfo.whatsapp && (
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="w-4 h-4 text-green-600" />
                          <span className="font-medium">WhatsApp:</span>
                          <span>{order.contactInfo.whatsapp}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(order.contactInfo.whatsapp)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    {order.contactInfo.telegram && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center space-x-3">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">Telegram:</span>
                          <span>{order.contactInfo.telegram}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(order.contactInfo.telegram)}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    {order.contactInfo.delivery && order.contactInfo.address && (
                      <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-start space-x-3">
                          <Truck className="w-4 h-4 text-orange-600 mt-0.5" />
                          <div>
                            <span className="font-medium block">Адрес доставки:</span>
                            <span className="text-sm text-muted-foreground">
                              {order.contactInfo.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )}

            {/* Форма отзыва */}
            {order.status === 'completed' && (
              <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-600" />
                    <span>Оценить заказ</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Поделитесь своим опытом, это поможет нам стать лучше
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6">
                    {/* Рейтинг звездочками */}
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Оценка (обязательно)
                      </Label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={cn(
                              "w-8 h-8 transition-colors",
                              star <= (hoverRating || rating)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            )}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                          >
                            <Star className="w-full h-full fill-current" />
                          </button>
                        ))}
                      </div>
                      {errors.rating && (
                        <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
                      )}
                    </div>

                    {/* Текст отзыва */}
                    <div>
                      <Label htmlFor="comment" className="text-sm font-medium mb-2 block">
                        Комментарий (10-500 символов)
                      </Label>
                      <Textarea
                        id="comment"
                        placeholder="Поделитесь своим опытом использования сервиса..."
                        rows={4}
                        {...register('comment')}
                      />
                      {errors.comment && (
                        <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? 'Отправляем...' : (order.hasReview ? 'Обновить отзыв' : 'Отправить отзыв')}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            {/* Быстрые действия */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Быстрые действия</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/exchange')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Новый обмен
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => navigate('/profile?tab=history')}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  История операций
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard(order.id)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Копировать ID
                </Button>
              </CardContent>
            </Card>

            {/* Поддержка */}
            <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-sm">Нужна помощь?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Наши специалисты готовы помочь с любыми вопросами по заказу
                </p>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard('+7 999 123-45-67')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  +7 999 123-45-67
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => copyToClipboard('@icambio_support')}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  @icambio_support
                </Button>
              </CardContent>
            </Card>

            {/* Безопасность */}
            <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Ваша безопасность</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">Данные зашифрованы</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">Лицензированный сервис</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-200" />
                  <span className="text-sm text-green-100">Гарантия возврата</span>
                </div>
              </CardContent>
            </Card>

            {/* Информация о времени */}
            {order.status !== 'completed' && order.status !== 'cancelled' && (
              <Card className="bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Время выполнения</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Обычно:</span>
                    <span className="font-medium ml-1">15-30 минут</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Максимум:</span>
                    <span className="font-medium ml-1">2 часа</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Время может увеличиваться в выходные и праздничные дни
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 