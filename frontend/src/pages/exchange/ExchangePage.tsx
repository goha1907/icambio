import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { CurrencyPairForm } from '@/features/exchange/components/CurrencyPairForm';
import { PlusCircle } from 'lucide-react';

// Уникальный идентификатор для ключей
let pairId = 1;

export function ExchangePage() {
  const navigate = useNavigate();
  const [pairs, setPairs] = useState([{ id: pairId++, fromAmount: 0 }]);

  const handleUpdatePair = (index: number, data: { fromAmount: number }) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], fromAmount: data.fromAmount };
    setPairs(newPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { id: pairId++, fromAmount: 0 }]);
  };

  const removePair = (idToRemove: number) => {
    setPairs(pairs.filter(pair => pair.id !== idToRemove));
  };

  const isOrderEnabled = pairs.every(pair => pair.fromAmount > 0);

  const handleCreateOrder = () => {
    // Здесь будет логика сбора данных со всех пар и перехода к следующему шагу
    console.log('Creating order with pairs:', pairs);
    navigate('/profile/orders'); // или на страницу второго шага
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <PageTitle
        title="Создать заявку на обмен"
        description="Добавьте одну или несколько валютных пар для обмена"
      />
      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle>Детали обмена</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-4">
            {pairs.map((pair, index) => (
              <CurrencyPairForm
                key={pair.id}
                onRateUpdate={(data) => handleUpdatePair(index, data)}
                isRemovable={pairs.length > 1}
                onRemove={() => removePair(pair.id)}
              />
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={addPair}
              className="flex items-center gap-2"
            >
              <PlusCircle size={18} />
              Добавить пару
            </Button>

            <Button
              onClick={handleCreateOrder}
              disabled={!isOrderEnabled}
              className="btn-primary"
            >
              Продолжить
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 