// frontend/src/components/profile/ExchangeHistory.tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table } from '@/components/ui/Table';

interface Exchange {
  id: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
}

interface ExchangeHistoryProps {
  exchanges: Exchange[];
}

export const ExchangeHistory = ({ exchanges }: ExchangeHistoryProps) => {
  const columns = [
    {
      key: 'date' as keyof Exchange,
      header: 'Дата',
      render: (value: string | number) => new Date(value as string).toLocaleDateString()
    },
    {
      key: 'fromAmount' as keyof Exchange,
      header: 'Отправлено',
      render: (value: string | number, item: Exchange) => 
        `${value} ${item.fromCurrency}`
    },
    {
      key: 'toAmount' as keyof Exchange,
      header: 'Получено',
      render: (value: string | number, item: Exchange) => 
        `${value} ${item.toCurrency}`
    },
    {
      key: 'status' as keyof Exchange,
      header: 'Статус',
      render: (value: string | number) => {
        const status = value as Exchange['status'];
        const statusStyles = {
          pending: 'text-yellow-600',
          completed: 'text-green-600',
          cancelled: 'text-red-600'
        };
        const statusText = {
          pending: 'В обработке',
          completed: 'Выполнен',
          cancelled: 'Отменен'
        };
        return (
          <span className={statusStyles[status]}>
            {statusText[status]}
          </span>
        );
      }
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>История обменов</CardTitle>
      </CardHeader>
      <CardContent>
        {exchanges.length > 0 ? (
          <Table data={exchanges} columns={columns} />
        ) : (
          <p className="text-center text-gray-500 py-4">
            У вас пока нет выполненных обменов
          </p>
        )}
      </CardContent>
    </Card>
  );
};