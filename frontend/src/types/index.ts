// Базовые типы пользователя для Django API
export interface IUserProfile {
  id: string;
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  whatsapp?: string;
  telegram?: string;
  preferred_delivery_address?: string;
  referral_code?: string;
  referral_link?: string;
  invited_by_code?: string;
  referralBalance?: number;
  referrals?: TUser[];
  roles?: string[]; // Добавлено для поддержки проверки ролей
}

// Объединенный тип пользователя для фронтенда
export type TUser = IUserProfile;

// Типы для Django JWT аутентификации
export interface DjangoJWTResponse {
  access: string;
  refresh: string;
}

export interface DjangoUser {
  id: string;
  email: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  date_joined: string;
  is_active: boolean;
}

// Типы для аутентификации
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  re_password: string;
}

// Типы для обновления профиля
export interface ProfileUpdateData {
  username?: string;
  first_name?: string;
  last_name?: string;
  whatsapp?: string;
  telegram?: string;
  preferred_delivery_address?: string;
}

// Типы для форм
import { UseFormRegister, FieldValues, Path, FieldErrors } from 'react-hook-form';

export type FormInputProps<T extends FieldValues> = {
  label?: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  required?: boolean;
};

export type FormFieldProps<T extends FieldValues> = FormInputProps<T> & {
  errors: FieldErrors<T>;
};

export interface Review {
  id?: string;
  user: {
    id: string;
    name: string;
    lastname: string;
  };
  rating: number;
  comment: string;
  created_at: string;
}
