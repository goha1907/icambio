import { z } from 'zod';

// Схема для входа
export const loginSchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Введите корректный email'),
  password: z
    .string()
    .min(1, 'Пароль обязателен')
    .min(6, 'Пароль должен содержать минимум 6 символов'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Схема для регистрации
export const registerSchema = z
  .object({
    email: z.string().min(1, 'Email обязателен').email('Введите корректный email'),
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

// Схема для сброса пароля
export const resetPasswordSchema = z.object({
  email: z.string().min(1, 'Email обязателен').email('Введите корректный email'),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Схема для установки нового пароля (после сброса)
export const setNewPasswordSchema = z
  .object({
    password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
    confirmPassword: z.string().min(1, 'Подтвердите пароль'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'],
  });

export type SetNewPasswordFormData = z.infer<typeof setNewPasswordSchema>;

// Схема для изменения пароля
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Текущий пароль обязателен'),
    newPassword: z.string().min(6, 'Новый пароль должен содержать минимум 6 символов'),
    confirmNewPassword: z.string().min(1, 'Подтвердите новый пароль'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmNewPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Схема для профиля
export const profileSchema = z.object({
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  whatsapp: z.string().optional(),
  telegram: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>; 