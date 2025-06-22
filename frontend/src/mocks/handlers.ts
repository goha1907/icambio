import { http, HttpResponse } from 'msw';

// Mock data
const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2 },
  { code: 'ARS', name: 'Argentine Peso', symbol: '$', type: 'fiat', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat', decimals: 2 },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', decimals: 8 },
];

const exchangeRates = [
  {
    id: 1,
    from_currency: { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2 },
    to_currency: { code: 'ARS', name: 'Argentine Peso', symbol: '$', type: 'fiat', decimals: 2 },
    rate: 900,
    minAmount: 10,
    maxAmount: 1000,
  },
  {
    id: 2,
    from_currency: { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat', decimals: 2 },
    to_currency: { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2 },
    rate: 1.1,
    minAmount: 10,
    maxAmount: 5000,
  },
  {
    id: 3,
    from_currency: { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', decimals: 8 },
    to_currency: { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2 },
    rate: 45000,
    minAmount: 0.001,
    maxAmount: 1,
  },
];

const reviews = [
  { id: '1', display_name: 'Alice', rating: 5, text: 'Great service!', created_at: '2024-01-15T10:00:00Z' },
  { id: '2', display_name: 'Bob', rating: 4, text: 'Good rates and fast.', created_at: '2024-01-14T15:30:00Z' },
  { id: '3', display_name: 'Carol', rating: 5, text: 'Excellent exchange rates and quick delivery!', created_at: '2024-01-13T09:15:00Z' },
];

export const handlers = [
  // Currencies
  http.get('/currencies/', () => {
    return HttpResponse.json(currencies);
  }),

  // Exchange rates
  http.get('/rates/', () => {
    return HttpResponse.json(exchangeRates);
  }),

  // Calculate exchange
  http.post('/rates/:id/calculate/', async ({ request, params }) => {
    const { id } = params;
    const rate = exchangeRates.find((r) => r.id === Number(id));
    if (!rate) {
      return new HttpResponse(null, { status: 404 });
    }
    const body = await request.json() as any;
    const { amount_from, amount_to } = body;
    let resultFrom = amount_from;
    let resultTo = amount_to;
    if (amount_from) {
      resultTo = amount_from * rate.rate;
    } else if (amount_to) {
      resultFrom = amount_to / rate.rate;
    }
    return HttpResponse.json({
      from_currency: rate.from_currency.code,
      to_currency: rate.to_currency.code,
      amount_from: resultFrom,
      amount_to: resultTo,
      rate: rate.rate,
      min_amount: rate.minAmount,
    });
  }),

  // Reviews
  http.get('/reviews/list_public/', () => {
    return HttpResponse.json(reviews);
  }),
]; 