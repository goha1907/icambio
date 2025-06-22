import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { exchangeOrderSchema, type ExchangeOrderFormData } from '@/shared/validation/exchange';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Alert } from '@/shared/ui/Alert';
import { ExchangeRow } from '@/features/exchange/components/ExchangeRow';
import { useNotification } from '@/lib/hooks/useNotification';
import type { Currency } from '@/features/exchange/types';

interface ExchangeFormProps {
  step: number;
  currencies: Currency[];
  onSubmitStep1: (data: Partial<ExchangeOrderFormData>) => void;
  onSubmitStep2: (data: ExchangeOrderFormData) => void;
}

export const ExchangeForm = ({
  step,
  currencies,
  onSubmitStep1,
  onSubmitStep2,
}: ExchangeFormProps) => {
  const { error } = useNotification();

  const {
    register,
    control,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ExchangeOrderFormData>({
    resolver: zodResolver(exchangeOrderSchema),
    defaultValues: {
      exchangePairs: [
        {
          fromCurrency: '',
          toCurrency: '',
          fromAmount: 0,
          toAmount: 0,
        },
      ],
      delivery: false,
      address: '',
      comment: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'exchangePairs',
  });

  const delivery = watch('delivery');

  // Вычисляем общую сумму
  const calculateTotalAmount = () => {
    const pairs = watch('exchangePairs');
    return pairs.reduce((sum, pair) => sum + (pair.fromAmount || 0), 0);
  };

  const onSubmit = async (data: ExchangeOrderFormData) => {
    try {
      if (step === 1) {
        onSubmitStep1(data);
      } else {
        onSubmitStep2({
          ...data,
          totalFromAmount: calculateTotalAmount(),
        });
      }
    } catch (err: any) {
      error(err.message || 'Ошибка при создании заказа');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="exchange-form">
      {step === 1 ? (
        <div className="exchange-pairs">
          {fields.map((field, index) => (
            <div key={field.id} className="exchange-pair-container">
              <ExchangeRow
                index={index}
                control={control}
                setValue={setValue}
                currencies={currencies}
                onRemove={() => remove(index)}
                isRemovable={fields.length > 1}
              />
            </div>
          ))}

          <div className="exchange-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  fromCurrency: '',
                  toCurrency: '',
                  fromAmount: 0,
                  toAmount: 0,
                })
              }
              className="add-pair-button"
            >
              Добавить валютную пару
            </Button>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              Продолжить
            </Button>
          </div>
        </div>
      ) : (
        <div className="contact-info">
          <div className="form-group">
            <Input
              label="WhatsApp"
              placeholder="+79123456789"
              {...register('whatsapp')}
              error={errors.whatsapp?.message}
            />
          </div>

          <div className="form-group">
            <Input
              label="Telegram"
              placeholder="@username"
              {...register('telegram')}
              error={errors.telegram?.message}
            />
          </div>

          <div className="form-group">
            <label className="form-checkbox">
              <input type="checkbox" {...register('delivery')} />
              <span>Нужна доставка</span>
            </label>
          </div>

          {delivery && (
            <div className="form-group">
              <Input
                label="Адрес доставки"
                {...register('address')}
                error={errors.address?.message}
              />
            </div>
          )}

          <div className="form-group">
            <Input
              label="Комментарий к заказу"
              {...register('comment')}
              error={errors.comment?.message}
            />
          </div>

          <div className="exchange-actions">
            <Button type="button" variant="secondary" onClick={() => onSubmitStep1({})}>
              Назад
            </Button>

            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Создание заказа...' : 'Создать заказ'}
            </Button>
          </div>
        </div>
      )}

      {errors.root && <Alert type="error">{errors.root.message}</Alert>}
    </form>
  );
};
