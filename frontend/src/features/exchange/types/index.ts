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