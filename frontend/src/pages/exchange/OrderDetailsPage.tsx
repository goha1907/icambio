import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { useNotification } from '@/lib/hooks/useNotification';
import { PageTitle } from '@/shared/ui/PageTitle';
import { IOrder } from '@/features/exchange/types';
import { MOCK_ORDER } from '@/lib/mock-data';

export function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {} = useNotification();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      if (id === MOCK_ORDER.id) {
        setOrder(MOCK_ORDER);
      } else {
        setOrder(null);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const statusText = {
    new: 'Новый',
    processing: 'В обработке',
    completed: 'Выполнен',
    cancelled: 'Отменен',
  } as const;

  if (loading) return <div className="container mx-auto text-center py-10"><PageTitle title="Загрузка информации о заказе..." /></div>;

  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <PageTitle title="Заказ не найден" />
        <Button onClick={() => navigate('/')}>На главную</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PageTitle title="Заказ успешно создан!" description={`ID вашего заказа: ${order.id}`} />

        <Card className="mt-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Детали заказа</CardTitle>
            <span className="text-sm font-medium">{statusText[order.status]}</span>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div>
              <h3 className="font-semibold">Пары для обмена:</h3>
              <ul className="list-disc list-inside">
                {order.pairs.map((p, idx) => (
                  <li key={idx}>
                    {p.amount} {p.fromCurrency} → {p.result?.toFixed(2)} {p.toCurrency}
                  </li>
                ))}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold">Контактная информация:</h3>
              <p>WhatsApp: {order.contactInfo.whatsapp || 'не указан'}</p>
              <p>Telegram: {order.contactInfo.telegram || 'не указан'}</p>
            </div>
             {order.contactInfo.delivery && (
                <div>
                    <h3 className="font-semibold">Доставка:</h3>
                    <p>Адрес: {order.contactInfo.address}</p>
                </div>
            )}
             {order.contactInfo.comment && (
                <div>
                    <h3 className="font-semibold">Комментарий:</h3>
                    <p>{order.contactInfo.comment}</p>
                </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
            <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    </div>
  );
} 