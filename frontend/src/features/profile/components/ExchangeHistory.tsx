import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/Table';
import { cn } from '@/lib/utils';

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

const statusStyles: Record<Exchange['status'], string> = {
  pending: 'text-amber-600 bg-amber-100/60',
  completed: 'text-green-600 bg-green-100/60',
  cancelled: 'text-red-600 bg-red-100/60',
};

const statusText: Record<Exchange['status'], string> = {
  pending: 'В обработке',
  completed: 'Выполнен',
  cancelled: 'Отменен',
};

export const ExchangeHistory = ({ exchanges }: ExchangeHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>История обменов</CardTitle>
      </CardHeader>
      <CardContent>
        {exchanges.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Отправлено</TableHead>
                  <TableHead>Получено</TableHead>
                  <TableHead className="text-right">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchanges.map((exchange) => (
                  <TableRow key={exchange.id}>
                    <TableCell>
                      {new Date(exchange.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {exchange.fromAmount} {exchange.fromCurrency}
                    </TableCell>
                    <TableCell>
                      {exchange.toAmount} {exchange.toCurrency}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'rounded-full px-2.5 py-0.5 text-xs font-medium',
                          statusStyles[exchange.status],
                        )}
                      >
                        {statusText[exchange.status]}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="py-4 text-center text-gray-500">
            У вас пока нет выполненных обменов
          </p>
        )}
      </CardContent>
    </Card>
  );
};
