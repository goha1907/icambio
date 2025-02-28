import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useNotification } from '@/lib/hooks/useNotification';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Clipboard, Check } from 'lucide-react';

// Временная имитация данных заказа
interface ExchangePair {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

interface Order {
  id: string;
  status: 'new' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  pairs: ExchangePair[];
  totalFromAmount: number;
  trackingUrl: string;
  contactInfo: {
    whatsapp?: string;
    telegram?: string;
    delivery: boolean;
    address?: string;
    comment?: string;
  };
}

// Функция для получения тестовых данных заказа
const getTestOrder = (orderId: string): Order => {
  return {
    id: orderId,
    status: 'new',
    createdAt: new Date().toISOString(),
    pairs: [
      { fromCurrency: 'USD', toCurrency: 'BTC', fromAmount: 500, toAmount: 0.012 },
      { fromCurrency: 'EUR', toCurrency: 'ETH', fromAmount: 300, toAmount: 0.15 },
    ],
    totalFromAmount: 800,
    trackingUrl: `http://localhost:5173/order/${orderId}`,
    contactInfo: {
      whatsapp: '+79123456789',
      telegram: '@username',
      delivery: true,
      address: 'Москва, ул. Примерная, д. 123',
      comment: 'Позвоните за час до доставки',
    },
  };
};

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { success } = useNotification();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // В реальном проекте здесь был бы API-запрос к серверу
    // Пока используем тестовые данные
    if (orderId) {
      const testOrder = getTestOrder(orderId);
      setOrder(testOrder);
      setLoading(false);
    }
  }, [orderId]);

  const handleCopyLink = () => {
    if (order) {
      navigator.clipboard.writeText(order.trackingUrl);
      setCopied(true);
      success('Ссылка скопирована в буфер обмена');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statuses = {
      new: 'Новый',
      processing: 'В обработке',
      completed: 'Выполнен',
      cancelled: 'Отменен',
    };
    return statuses[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      processing: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status];
  };

  if (loading) {
    return <div className="page-container">Загрузка...</div>;
  }

  if (!order) {
    return (
      <div className="page-container">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold">Заказ не найден</h2>
              <p className="mt-4">Запрошенный заказ не существует или был удален.</p>
              <Button variant="primary" className="mt-6" onClick={() => navigate('/')}>
                Вернуться на главную
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle
          title="Детали заказа"
          description="Спасибо за ваш заказ! Здесь вы можете отслеживать его статус."
        />

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Заказ #{order.id}</CardTitle>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}
            >
              {getStatusText(order.status)}
            </span>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Ссылка для отслеживания */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Ссылка для отслеживания заказа</h3>
              <div className="flex items-center">
                <input
                  type="text"
                  value={order.trackingUrl}
                  readOnly
                  className="form-input flex-grow mr-2 bg-white"
                />
                <Button
                  variant="secondary"
                  onClick={handleCopyLink}
                  className="flex items-center space-x-1"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Clipboard size={16} />
                      <span>Копировать</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Сохраните эту ссылку, чтобы в любой момент проверить статус заказа.
              </p>
            </div>

            {/* Детали заказа */}
            <div>
              <h3 className="text-lg font-medium mb-3">Детали обмена</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {order.pairs.map((pair, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div className="font-medium">
                      {pair.fromAmount} {pair.fromCurrency}
                    </div>
                    <div className="text-gray-500">→</div>
                    <div className="font-medium">
                      {pair.toAmount} {pair.toCurrency}
                    </div>
                  </div>
                ))}

                <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between">
                  <span className="font-bold">Итого:</span>
                  <span className="font-bold">{order.totalFromAmount}</span>
                </div>
              </div>
            </div>

            {/* Контактная информация */}
            <div>
              <h3 className="text-lg font-medium mb-3">Контактная информация</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.contactInfo.whatsapp && (
                  <div>
                    <span className="block text-sm text-gray-500">WhatsApp:</span>
                    <span>{order.contactInfo.whatsapp}</span>
                  </div>
                )}

                {order.contactInfo.telegram && (
                  <div>
                    <span className="block text-sm text-gray-500">Telegram:</span>
                    <span>{order.contactInfo.telegram}</span>
                  </div>
                )}
              </div>

              {order.contactInfo.delivery && (
                <div className="mt-4">
                  <span className="block text-sm text-gray-500">Адрес доставки:</span>
                  <span>{order.contactInfo.address}</span>
                </div>
              )}

              {order.contactInfo.comment && (
                <div className="mt-4">
                  <span className="block text-sm text-gray-500">Комментарий к заказу:</span>
                  <p className="text-gray-700">{order.contactInfo.comment}</p>
                </div>
              )}
            </div>

            {/* Дата создания */}
            <div className="text-sm text-gray-500 pt-4 border-t border-gray-200">
              Создан: {new Date(order.createdAt).toLocaleString()}
            </div>

            {/* Кнопки управления */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => navigate('/')}>
                На главную
              </Button>

              <Button variant="primary" onClick={() => navigate('/exchange')}>
                Создать новый заказ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
