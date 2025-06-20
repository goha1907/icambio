import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useNotification } from '@/lib/hooks/useNotification';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Clipboard, Check } from 'lucide-react';

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

const getTestOrder = (orderId: string): Order => ({
  id: orderId,
  status: 'new',
  createdAt: new Date().toISOString(),
  pairs: [
    { fromCurrency: 'USD', toCurrency: 'BTC', fromAmount: 500, toAmount: 0.012 },
    { fromCurrency: 'EUR', toCurrency: 'ETH', fromAmount: 300, toAmount: 0.15 },
  ],
  totalFromAmount: 800,
  trackingUrl: `${window.location.origin}/orders/${orderId}`,
  contactInfo: {
    whatsapp: '+79123456789',
    telegram: '@username',
    delivery: true,
    address: 'Москва, ул. Примерная, д. 123',
    comment: 'Позвоните за час до доставки',
  },
});

export function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { success } = useNotification();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (orderId) {
      const test = getTestOrder(orderId);
      setOrder(test);
      setLoading(false);
    }
  }, [orderId]);

  const handleCopyLink = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.trackingUrl);
    setCopied(true);
    success('Ссылка скопирована в буфер обмена');
    setTimeout(() => setCopied(false), 2000);
  };

  const statusText = {
    new: 'Новый',
    processing: 'В обработке',
    completed: 'Выполнен',
    cancelled: 'Отменен',
  } as const;

  const statusColor = {
    new: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  } as const;

  if (loading) return <div className="page-container">Загрузка...</div>;
  if (!order)
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

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle title="Детали заказа" description="Спасибо за ваш заказ! Здесь вы можете отслеживать его статус." />

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Заказ #{order.id}</CardTitle>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[order.status]}`}>
              {statusText[order.status]}
            </span>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tracking link */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Ссылка для отслеживания заказа</h3>
              <div className="flex items-center">
                <input type="text" value={order.trackingUrl} readOnly className="form-input flex-grow mr-2 bg-white" />
                <Button variant="secondary" onClick={handleCopyLink} className="flex items-center space-x-1">
                  {copied ? (
                    <>
                      <Check size={16} /> <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Clipboard size={16} /> <span>Копировать</span>
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-2">Сохраните эту ссылку, чтобы в любой момент проверить статус заказа.</p>
            </div>

            {/* Details */}
            <div>
              <h3 className="text-lg font-medium mb-3">Детали обмена</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {order.pairs.map((p, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                    <div className="font-medium">{p.fromAmount} {p.fromCurrency}</div>
                    <div className="text-gray-500">→</div>
                    <div className="font-medium">{p.toAmount} {p.toCurrency}</div>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t border-gray-300 flex justify-between">
                  <span className="font-bold">Итого:</span>
                  <span className="font-bold">{order.totalFromAmount}</span>
                </div>
              </div>
            </div>

            {/* Contacts */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-3">Контактная информация</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {order.contactInfo.whatsapp && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="font-medium">WhatsApp:</span> {order.contactInfo.whatsapp}
                  </div>
                )}
                {order.contactInfo.telegram && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <span className="font-medium">Telegram:</span> {order.contactInfo.telegram}
                  </div>
                )}
                {order.contactInfo.delivery && (
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <span className="font-medium">Адрес доставки:</span> {order.contactInfo.address}
                  </div>
                )}
                {order.contactInfo.comment && (
                  <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                    <span className="font-medium">Комментарий:</span> {order.contactInfo.comment}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 