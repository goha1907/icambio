import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/Select';
import { Input } from '@/shared/ui/Input';
import { DatePicker, DateRange } from '@/shared/ui/DatePicker';
import { cn } from '@/lib/utils';
import { Edit, Eye, MessageSquare } from 'lucide-react';

// Типы данных
interface ExchangePair {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: number;
}

interface Exchange {
  id: string;
  date: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  hasReview?: boolean;
  pairs: ExchangePair[];
}

interface FilterState {
  dateRange: DateRange;
  sentAmount: string;
  receivedAmount: string;
  status: string;
  reviewStatus: string;
}

interface ExchangeHistoryProps {
  exchanges: Exchange[];
}

/**
 * Компонент истории обменов пользователя
 * 
 * Отображает таблицу с историей обменов пользователя с фильтрами
 */
export const ExchangeHistory = ({ exchanges }: ExchangeHistoryProps) => {
  const navigate = useNavigate();
  
  const [filters, setFilters] = useState<FilterState>({
    dateRange: { from: null, to: null },
    sentAmount: '',
    receivedAmount: '',
    status: '',
    reviewStatus: '',
  });

  // Стили для статусов
  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  const statusText = {
    pending: 'В обработке',
    completed: 'Выполнен',
    cancelled: 'Отменен',
  };

  // Функция для определения статуса отзыва
  const getReviewStatus = (exchange: Exchange): string => {
    if (exchange.status !== 'completed') return 'unavailable';
    if (exchange.hasReview) return 'edit';
    return 'create';
  };

  // Функция для форматирования отображения обмена
  const formatExchangeDisplay = (exchange: Exchange) => {
    if (exchange.pairs.length === 1) {
      const pair = exchange.pairs[0];
      return {
        sent: `${pair.amount} ${pair.fromCurrency}`,
        received: `${pair.result} ${pair.toCurrency}`,
        sentAmount: pair.amount,
        receivedAmount: pair.result,
      };
    } else {
      // Для мультивалютных обменов показываем общую информацию
      const totalSent = exchange.pairs.reduce((sum, pair) => sum + pair.amount, 0);
      const totalReceived = exchange.pairs.reduce((sum, pair) => sum + pair.result, 0);
      const lastPair = exchange.pairs[exchange.pairs.length - 1];
      return {
        sent: `${exchange.pairs.length} валют`,
        received: `${totalReceived} ${lastPair.toCurrency}`,
        sentAmount: totalSent,
        receivedAmount: totalReceived,
      };
    }
  };

  // Фильтрация данных
  const filteredExchanges = useMemo(() => {
    return exchanges.filter(exchange => {
      // Фильтр по дате
      if (filters.dateRange.from || filters.dateRange.to) {
        const exchangeDate = new Date(exchange.date);
        if (filters.dateRange.from && exchangeDate < filters.dateRange.from) return false;
        if (filters.dateRange.to && exchangeDate > filters.dateRange.to) return false;
      }

      // Фильтр по отправленной сумме
      if (filters.sentAmount) {
        const amount = parseFloat(filters.sentAmount);
        const display = formatExchangeDisplay(exchange);
        if (!isNaN(amount) && display.sentAmount !== amount) return false;
      }

      // Фильтр по полученной сумме
      if (filters.receivedAmount) {
        const amount = parseFloat(filters.receivedAmount);
        const display = formatExchangeDisplay(exchange);
        if (!isNaN(amount) && display.receivedAmount !== amount) return false;
      }

      // Фильтр по статусу
      if (filters.status && exchange.status !== filters.status) {
        return false;
      }

      // Фильтр по статусу отзыва
      if (filters.reviewStatus) {
        const reviewStatus = getReviewStatus(exchange);
        if (reviewStatus !== filters.reviewStatus) return false;
      }

      return true;
    });
  }, [exchanges, filters]);

  // Обработчики изменения фильтров
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === '__clear__' ? (key === 'dateRange' ? { from: null, to: null } : '') : value
    }));
  };

  // Очистка всех фильтров
  const clearFilters = () => {
    setFilters({
      dateRange: { from: null, to: null },
      sentAmount: '',
      receivedAmount: '',
      status: '',
      reviewStatus: '',
    });
  };

  // Проверка наличия активных фильтров
  const hasActiveFilters = 
    filters.dateRange.from || filters.dateRange.to ||
    filters.sentAmount || filters.receivedAmount ||
    filters.status || filters.reviewStatus;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>История обменов</CardTitle>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕ Очистить
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {exchanges.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-48"
                    filterComponent={
                      <DatePicker
                        value={filters.dateRange}
                        onChange={(range) => handleFilterChange('dateRange', range)}
                        placeholder="Выберите период"
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    }
                  >
                    Дата
                  </TableHead>
                  
                  <TableHead 
                    className="w-40"
                    filterComponent={
                      <Input
                        type="number"
                        placeholder="Сумма"
                        value={filters.sentAmount}
                        onChange={(e) => handleFilterChange('sentAmount', e.target.value)}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    }
                  >
                    Отправлено
                  </TableHead>
                  
                  <TableHead 
                    className="w-40"
                    filterComponent={
                      <Input
                        type="number"
                        placeholder="Сумма"
                        value={filters.receivedAmount}
                        onChange={(e) => handleFilterChange('receivedAmount', e.target.value)}
                        className="text-foreground placeholder:text-muted-foreground"
                      />
                    }
                  >
                    Получено
                  </TableHead>
                  
                  <TableHead 
                    className="w-36"
                    filterComponent={
                      <Select 
                        value={filters.status || undefined} 
                        onValueChange={(value) => handleFilterChange('status', value)}
                      >
                        <SelectTrigger className="text-foreground">
                          <SelectValue placeholder="Все статусы" className="text-muted-foreground" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__clear__">Все статусы</SelectItem>
                          <SelectItem value="pending">В обработке</SelectItem>
                          <SelectItem value="completed">Выполнен</SelectItem>
                          <SelectItem value="cancelled">Отменен</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  >
                    Статус
                  </TableHead>
                  
                  <TableHead 
                    className="w-36"
                    filterComponent={
                      <Select 
                        value={filters.reviewStatus || undefined} 
                        onValueChange={(value) => handleFilterChange('reviewStatus', value)}
                      >
                        <SelectTrigger className="text-foreground">
                          <SelectValue placeholder="Все отзывы" className="text-muted-foreground" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__clear__">Все отзывы</SelectItem>
                          <SelectItem value="unavailable">Недоступен</SelectItem>
                          <SelectItem value="create">Оставить</SelectItem>
                          <SelectItem value="edit">Изменить</SelectItem>
                        </SelectContent>
                      </Select>
                    }
                  >
                    Отзывы
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExchanges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        По выбранным фильтрам обмены не найдены
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Попробуйте изменить параметры поиска
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredExchanges.map((exchange) => {
                    const display = formatExchangeDisplay(exchange);
                    return (
                      <TableRow key={exchange.id}>
                        <TableCell className="w-48">
                          <div className="text-sm font-medium text-foreground">
                            {new Date(exchange.date).toLocaleDateString('ru-RU')}
                          </div>
                        </TableCell>
                        <TableCell className="w-40">
                          <div className="text-sm font-medium text-foreground">
                            {exchange.pairs.length === 1 ? (
                              display.sent
                            ) : (
                              <div className="space-y-1">
                                {exchange.pairs.map((pair, idx) => (
                                  <div key={idx} className="text-sm">
                                    {pair.amount} {pair.fromCurrency}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="w-40">
                          <div className="text-sm font-medium text-foreground">
                            {exchange.pairs.length === 1 ? (
                              display.received
                            ) : (
                              <div className="space-y-1">
                                {exchange.pairs.map((pair, idx) => (
                                  <div key={idx} className="text-sm">
                                    {pair.result} {pair.toCurrency}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="w-36">
                          <span
                            className={cn(
                              'rounded-full px-2.5 py-0.5 text-xs font-medium',
                              statusStyles[exchange.status],
                            )}
                          >
                            {statusText[exchange.status]}
                          </span>
                        </TableCell>
                        <TableCell className="w-36">
                          <div className="flex items-center gap-2">
                            {/* Отзыв - только для выполненных заказов */}
                            {exchange.status === 'completed' ? (
                              <button
                                onClick={() => navigate(`/order/${exchange.id}`)}
                                className="text-amber-600 hover:text-amber-700 transition-colors p-1"
                                title={exchange.hasReview ? "Изменить отзыв" : "Оставить отзыв"}
                              >
                                {exchange.hasReview ? (
                                  <Edit className="h-4 w-4" />
                                ) : (
                                  <MessageSquare className="h-4 w-4" />
                                )}
                              </button>
                            ) : (
                              <div className="w-6 h-6 flex items-center justify-center">
                                <span className="text-gray-300">—</span>
                              </div>
                            )}

                            {/* Посмотреть детали */}
                            <button
                              onClick={() => navigate(`/order/${exchange.id}`)}
                              className="text-gray-600 hover:text-gray-800 transition-colors p-1"
                              title="Посмотреть детали заказа"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              У вас пока нет выполненных обменов
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Создайте свой первый заказ на обмен валют
            </p>
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => navigate('/exchange')}
            >
              Создать заказ
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};