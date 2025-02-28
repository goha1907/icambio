import { z } from 'zod';
import type { Currency } from '@/types';
import { CURRENCY_DECIMALS } from '@/types';

// Функция для определения количества знаков после запятой
const getDecimalPlaces = (currency: Currency): number => {
  return currency.type === 'fiat' ? CURRENCY_DECIMALS.fiat : CURRENCY_DECIMALS.crypto;
};

// Схема для одной пары обмена
export const exchangePairSchema = z
  .object({
    fromCurrency: z.string().min(1, 'Выберите валюту отправления'),
    toCurrency: z.string().min(1, 'Выберите валюту получения'),
    fromAmount: z.number().positive('Сумма должна быть больше 0'),
    toAmount: z.number().positive('Сумма должна быть больше 0'),
  })
  .refine((data) => data.fromCurrency !== data.toCurrency, {
    message: 'Выберите разные валюты для обмена',
    path: ['toCurrency'],
  });

// Схема для заказа
export const exchangeOrderSchema = z
  .object({
    exchangePairs: z.array(exchangePairSchema).min(1, 'Добавьте хотя бы одну валютную пару'),

    totalFromAmount: z.number().positive('Общая сумма должна быть больше 0'),

    whatsapp: z
      .string()
      .regex(/^\+?[1-9]\d{1,14}$/, 'Введите корректный номер WhatsApp')
      .optional()
      .or(z.literal('')),

    telegram: z
      .string()
      .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Введите корректный username Telegram')
      .optional()
      .or(z.literal('')),

    delivery: z.boolean().optional(),

    address: z.string().min(1, 'Введите адрес доставки').optional().or(z.literal('')),

    comment: z
      .string()
      .max(500, 'Комментарий не должен превышать 500 символов')
      .optional()
      .or(z.literal('')),
  })
  .refine((data) => data.whatsapp || data.telegram, {
    message: 'Укажите хотя бы один способ связи (WhatsApp или Telegram)',
    path: ['whatsapp'],
  })
  .refine((data) => !data.delivery || data.address, {
    message: 'При выборе доставки необходимо указать адрес',
    path: ['address'],
  });

// Определяем типы на основе схем валидации
export type ExchangePairFormData = z.infer<typeof exchangePairSchema>;
export type ExchangeOrderFormData = z.infer<typeof exchangeOrderSchema>;

// Хелпер для форматирования суммы с учетом типа валюты
export const formatAmount = (amount: number, currency: Currency): string => {
  const decimals = getDecimalPlaces(currency);
  return amount.toFixed(decimals);
};
