  export interface User {
    id: number;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    telegram?: string;
    avatar?: string;
    referralCode?: string;
    referralBalance?: number;
  }
  
  export interface Branch {
    id: number;
    name: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
    workingHours: Record<string, { open: string; close: string }>;
  }
  
  export interface Currency {
    id: number;
    code: string;
    name: string;
    symbol: string;
  }
  
  export interface ExchangeRate {
    id: number;
    branch: number;
    fromCurrency: Currency;
    toCurrency: Currency;
    rate: number;
    minAmount: number;
    isActive: boolean;
  }