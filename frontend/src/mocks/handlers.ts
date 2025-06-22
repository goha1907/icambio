import { rest } from 'msw';

// Mock data
const currencies = [
  { id: 1, code: 'USD', name: 'US Dollar', symbol: '$' },
  { id: 2, code: 'ARS', name: 'Argentine Peso', symbol: '$' },
  { id: 3, code: 'EUR', name: 'Euro', symbol: '€' },
];

const exchangeRates = [
  {
    id: 1,
    from_currency: { code: 'USD' },
    to_currency: { code: 'ARS' },
    rate: 900,
    minAmount: 10,
    maxAmount: 1000,
  },
  {
    id: 2,
    from_currency: { code: 'EUR' },
    to_currency: { code: 'USD' },
    rate: 1.1,
    minAmount: 10,
    maxAmount: 5000,
  },
];

const reviews = [
  { id: 1, author: 'Alice', rating: 5, comment: 'Great service!' },
  { id: 2, author: 'Bob', rating: 4, comment: 'Good rates and fast.' },
];

export const handlers = [
  // Currencies
  rest.get('/currencies/', (_req: any, res: any, ctx: any) => {
    return res(ctx.status(200), ctx.json(currencies));
  }),

  // Exchange rates
  rest.get('/rates/', (_req: any, res: any, ctx: any) => {
    return res(ctx.status(200), ctx.json(exchangeRates));
  }),

  // Calculate exchange
  rest.post('/rates/:id/calculate/', (req: any, res: any, ctx: any) => {
    const { id } = req.params as { id: string };
    const rate = exchangeRates.find((r) => r.id === Number(id));
    if (!rate) {
      return res(ctx.status(404));
    }
    // Simple calc: amount_from * rate -> amount_to
    const { amount_from, amount_to } = req.body as any;
    let resultFrom = amount_from;
    let resultTo = amount_to;
    if (amount_from) {
      resultTo = amount_from * rate.rate;
    } else if (amount_to) {
      resultFrom = amount_to / rate.rate;
    }
    return res(
      ctx.status(200),
      ctx.json({
        from_currency: rate.from_currency.code,
        to_currency: rate.to_currency.code,
        amount_from: resultFrom,
        amount_to: resultTo,
        rate: rate.rate,
        min_amount: rate.minAmount,
      })
    );
  }),

  // Reviews
  rest.get('/reviews/list_public/', (_req: any, res: any, ctx: any) => {
    return res(ctx.status(200), ctx.json(reviews));
  }),
]; 