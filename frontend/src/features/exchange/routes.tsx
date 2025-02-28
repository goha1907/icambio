import { RouteObject } from 'react-router-dom';
import { ExchangePage } from '@/features/exchange/pages/ExchangePage.tsx';
import { OrderDetailsPage } from '@/features/exchange/pages/OrderDetailsPage';

export const exchangeRoutes: RouteObject[] = [
  {
    path: 'exchange',
    element: <ExchangePage />,
  },
  {
    path: 'orders/:orderId',
    element: <OrderDetailsPage />,
  },
];
