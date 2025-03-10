import { z } from 'zod';

export const profileSchema = z.object({
  email: z.string().email('Некорректный email'),

  username: z
    .string()
    .min(3, 'Никнейм должен содержать минимум 3 символа')
    .optional()
    .or(z.literal('')),

  first_name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .optional()
    .or(z.literal('')),

  last_name: z
    .string()
    .min(2, 'Фамилия должна содержать минимум 2 символа')
    .optional()
    .or(z.literal('')),

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
});

export type ProfileFormData = z.infer<typeof profileSchema>;
