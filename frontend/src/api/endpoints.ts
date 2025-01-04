export const ENDPOINTS = {
    AUTH: {
      LOGIN: 'auth/jwt/create/',
      REGISTER: 'auth/users/',
      REFRESH: 'auth/jwt/refresh/',
      ME: 'users/me/',
      CHANGE_PASSWORD: 'users/change_password/',
    },
    EXCHANGE: {
      CURRENCIES: 'exchange/currencies/',
      BRANCHES: 'exchange/branches/',
      RATES: 'exchange/rates/',
      CALCULATE: 'exchange/rates/calculate_exchange/',
    },
    ORDERS: {
      LIST: 'orders/',
      REVIEWS: 'reviews/',
    },
    PROFILE: {
      UPDATE: 'users/update_me/',
      AVATAR: 'users/delete_avatar/',
    },
  } as const;