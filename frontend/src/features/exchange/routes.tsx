import { RouteObject } from 'react-router-dom';
import { ExchangePage } from '@/pages/exchange/ExchangePage';
import { CreateOrderPage } from '@/pages/exchange/CreateOrderPage';
import { OrderDetailsPage } from '@/pages/exchange/OrderDetailsPage';

export const exchangeRoutes: RouteObject[] = [
  {
    path: 'exchange',
    element: <ExchangePage />,
  },
  {
    path: 'exchange/details',
    element: <CreateOrderPage />,
  },
  {
    path: 'order/:id',
    element: <OrderDetailsPage />,
  },
];
