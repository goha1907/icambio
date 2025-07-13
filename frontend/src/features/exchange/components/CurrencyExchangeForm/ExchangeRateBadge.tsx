import { Badge } from '@/shared/ui/Badge';
import { TrendingUp, AlertCircle } from 'lucide-react';

interface ExchangeRateBadgeProps {
  rate: number | null;
  isDirectionAvailable: boolean;
  fromCurrency?: { code: string; symbol: string };
  toCurrency?: { code: string; symbol: string };
}

/**
 * ExchangeRateBadge – компонент для отображения курса обмена и предупреждений.
 */
export const ExchangeRateBadge: React.FC<ExchangeRateBadgeProps> = ({ 
  rate, 
  isDirectionAvailable, 
  fromCurrency, 
  toCurrency 
}) => {
  if (!fromCurrency || !toCurrency) return null;

  if (!isDirectionAvailable) {
    return (
      <Badge variant="destructive" className="flex items-center gap-1">
        <AlertCircle className="h-4 w-4" />
        Направление недоступно
      </Badge>
    );
  }

  if (rate == null) return null;

  return (
    <Badge variant="secondary" className="flex items-center gap-1">
      <TrendingUp className="h-4 w-4" />
      1 {fromCurrency.code} = {rate.toFixed(4)} {toCurrency.code}
    </Badge>
  );
}; 