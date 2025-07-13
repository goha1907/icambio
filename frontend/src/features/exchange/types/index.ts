// =================================================================
//                    ТИПЫ ПОД СТРУКТУРУ БД
// =================================================================

// Валюты (таблица currencies)
export interface CurrencyDB {
  id: number;
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  created_at: string;
}

// Адреса (таблица addresses)
export interface AddressDB {
  id: number;
  country: string;
  city: string;
  street: string;
  house_number: string;
  postal_code: string;
  full_address: string;
  latitude: number;
  longitude: number;
  created_at: string;
}

// Филиалы (таблица branches)
export interface BranchDB {
  id: number;
  name: string;
  email: string;
  whatsapp: number;
  telegram: string;
  instagram: string;
  address_id: number;
  is_active: boolean;
  created_at: string;
}

// График работы филиалов (таблица branch_hours)
export interface BranchHoursDB {
  id: number;
  branch_id: number;
  weekday: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  open_time: string;
  close_time: string;
  is_open: boolean;
}

// Валюты филиалов (таблица branch_currencies)
export interface BranchCurrencyDB {
  id: number;
  branch_id: number;
  currency_id: number;
  amount: number;
}

// Курсы обмена (таблица exchange_rates)
export interface ExchangeRateDB {
  id: number;
  currency_from_id: number;
  currency_to_id: number;
  branch_id: number;
  min_amount: number;
  max_amount: number | null;
  rate: number;
  is_hot: boolean;
  visible: boolean;
  in_filter: boolean;
  updated_at: string;
}

// Пользователи (таблица users)
export interface UserDB {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  whatsapp: number;
  telegram: string;
  address_id: number | null;
  referral_code: string;
  referred_by_code: string | null;
  role: string;
  created_at: string;
}

// Заказы (таблица orders)
export interface OrderDB {
  id: string;
  user_id: string;
  branch_id: number;
  currency_from_id: number;
  currency_to_id: number;
  amount_from: number;
  amount_to: number;
  applied_rate: number;
  status: 'pending' | 'completed' | 'canceled';
  delivery: boolean;
  delivery_address_id: number | null;
  created_at: string;
  completed_at: string | null;
}

// Отзывы (таблица reviews)
export interface ReviewDB {
  id: number;
  user_id: string;
  order_id: string;
  rating: number;
  comment: string;
  visible: boolean;
  created_at: string;
}

// =================================================================
//                    СОВМЕСТИМЫЕ ТИПЫ (для постепенной миграции)
// =================================================================

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  is_crypto: boolean;
  decimal_digits: number;
}

export interface User {
  id: string;
  name: string;
  lastname: string;
}

export interface Review {
  id: string;
  user: User;
  rating: number;
  comment: string;
  created_at: string;
}

export const CURRENCY_DECIMALS = {
  fiat: 2, // для фиатных валют (USD, EUR, RUB и т.д.)
  crypto: 8, // значение по умолчанию для криптовалют
} as const;

export interface ExchangeRate {
  id: number;
  from_currency: Currency;
  to_currency: Currency;
  rate: number;
  minAmount: number;
  maxAmount?: number;
  is_hot?: boolean;
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

export interface IExchangePair {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result?: number;
}

export interface IOrder {
  id: string;
  status: 'created' | 'processing' | 'completed' | 'cancelled';
  createdAt: string;
  pairs: IExchangePair[];
  totalFromAmount: number;
  trackingUrl: string;
  contactInfo: {
    whatsapp?: string;
    telegram?: string;
    delivery: boolean;
    address?: string;
    comment?: string;
  };
} 