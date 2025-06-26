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