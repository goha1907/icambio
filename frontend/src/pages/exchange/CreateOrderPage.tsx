import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { exchangeOrderSchema } from '@/shared/validation/exchange';
import { Label } from '@/shared/ui/Label';

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

export function CreateOrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderData } = location.state || {};

  const form = useForm<ContactDetailsFormData>({
    resolver: zodResolver(step2Schema),
    defaultValues: { delivery: false, whatsapp: '', telegram: '', address: '', comment: '' },
  });

  const { register, handleSubmit, formState: { errors }, watch } = form;
  const delivery = watch('delivery');

  if (!orderData || !orderData.pairs || orderData.pairs.length === 0) {
    return <Navigate to="/exchange" replace />;
  }

  const onSubmit = (contactData: ContactDetailsFormData) => {
    const finalOrder = {
      exchangePairs: orderData.pairs,
      totalFromAmount: orderData.pairs.reduce((acc: number, p: any) => acc + p.amount, 0),
      ...contactData,
    };
    console.log('Final Order Payload:', finalOrder);
    navigate(`/order/mock-order-123`);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle title="Шаг 2: Детали заказа" description="Заполните информацию для связи и доставки" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader><CardTitle>Информация для связи</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input id="whatsapp" {...register('whatsapp')} />
              {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp.message}</p>}
            </div>
            <div>
              <Label htmlFor="telegram">Telegram</Label>
              <Input id="telegram" {...register('telegram')} />
              {errors.telegram && <p className="text-red-500 text-sm">{errors.telegram.message}</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Информация о доставке</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="delivery" {...register('delivery')} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              <Label htmlFor="delivery">Нужна доставка?</Label>
            </div>
            {delivery && (
              <div>
                <Label htmlFor="address">Адрес доставки</Label>
                <textarea id="address" {...register('address')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
                {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Дополнительно</CardTitle></CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="comment">Комментарий к заказу</Label>
              <textarea id="comment" {...register('comment')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              {errors.comment && <p className="text-red-500 text-sm">{errors.comment.message}</p>}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end">
          <Button type="submit">Создать заказ</Button>
        </div>
      </form>
    </div>
  );
} 