import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { CurrencyPairForm } from '@/features/exchange/components/CurrencyPairForm';
import { PlusCircle } from 'lucide-react';

const exchangeFormSchema = z.object({
  pairs: z.array(
    z.object({
      fromCurrency: z.string(),
      toCurrency: z.string(),
      amount: z.number().min(0.01, "Сумма должна быть больше 0"),
      result: z.number().optional(),
    })
  ),
});

type ExchangeFormData = z.infer<typeof exchangeFormSchema>;

export function ExchangePage() {
  const navigate = useNavigate();

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeFormSchema),
    defaultValues: {
      pairs: [{ fromCurrency: 'USDT', toCurrency: 'ARS', amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'pairs',
  });

  const onSubmit = (data: ExchangeFormData) => {
    console.log('Step 1 data:', data);
    navigate(`/exchange/details`, { state: { orderData: data } });
  };

  return (
    <div className="container mx-auto py-8 px-4">
        <PageTitle
        title="Создать заявку на обмен"
        description="Добавьте одну или несколько валютных пар для обмена"
        />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle>Детали обмена</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <CurrencyPairForm
                    key={field.id}
                    index={index}
                    isRemovable={fields.length > 1}
                    onRemove={() => remove(index)}
                  />
                ))}
                      </div>

              <div className="flex justify-between items-center mt-6">
                          <Button
                type="button"
                variant="outline"
                onClick={() => append({ fromCurrency: 'USDT', toCurrency: 'ARS', amount: 0 })}
                className="flex items-center gap-2"
                          >
                <PlusCircle size={18} />
                Добавить пару
                          </Button>

                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                >
                      Продолжить
                    </Button>
                  </div>
            </CardContent>
          </Card>
        </form>
      </FormProvider>
    </div>
  );
} 