// Базовые типы пользователя
export interface User {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  whatsapp?: string;
  telegram?: string;
  referral_link?: string;
  referralBalance?: number;
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

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
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

// Типы для обмена валют
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  type: 'fiat' | 'crypto';
  decimals: number;
}

export const CURRENCY_DECIMALS = {
  fiat: 2, // для фиатных валют (USD, EUR, RUB и т.д.)
  crypto: 8, // значение по умолчанию для криптовалют
} as const;

export interface ExchangeRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  minAmount: number;
  maxAmount?: number;
}

export interface ExchangePair {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

export interface ExchangeOrder {
  exchangePairs: ExchangePair[];
  totalFromAmount: number;
  whatsapp?: string;
  telegram?: string;
  delivery?: boolean;
  address?: string;
  comment?: string;
}

export interface ExchangeState {
  rates: ExchangeRate[];
  loading: boolean;
  error: string | null;
}

export interface Review {
  id: string;
  author: string;
  date: string;
  rating: number;
  text: string;
}
