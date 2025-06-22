// Базовые типы пользователя
import { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

// Интерфейс для данных профиля, хранящихся в user_metadata или отдельной таблице
export interface IUserProfile {
  id: string; // ID пользователя из нашей БД Django
  username?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  whatsapp?: string;
  telegram?: string;
  referral_link?: string;
  referralBalance?: number;
}

// Объединенный тип пользователя для фронтенда
export type TUser = SupabaseUser & IUserProfile;

export type { SupabaseUser, SupabaseSession };

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
  display_name: string;
  created_at: string;
  rating: number;
  text: string;
}
