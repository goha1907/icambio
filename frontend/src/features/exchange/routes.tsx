import { RouteObject } from 'react-router-dom';
import { ExchangePage } from '@/pages/exchange/ExchangePage';
import { OrderDetailsPage } from '@/pages/exchange/OrderDetailsPage';

export const exchangeRoutes: RouteObject[] = [
  {
    path: 'exchange',
    element: <ExchangePage />,
  },
  {
    path: 'order/:id',
    element: <OrderDetailsPage />,
  },
];
