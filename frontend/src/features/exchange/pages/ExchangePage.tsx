import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useNotification } from '@/lib/hooks/useNotification';
import { useNavigate } from 'react-router-dom';
import type { Currency } from '@/types';

// Временные данные для демонстрации
const currencies: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', type: 'fiat', decimals: 2 },
  { code: 'EUR', name: 'Euro', symbol: '€', type: 'fiat', decimals: 2 },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', type: 'fiat', decimals: 2 },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', type: 'crypto', decimals: 8 },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', type: 'crypto', decimals: 6 },
  { code: 'USDT', name: 'Tether', symbol: '₮', type: 'crypto', decimals: 6 },
];

// Интерфейс для валютной пары
interface ExchangePair {
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
}

// Интерфейс для контактных данных
interface ContactInfo {
  whatsapp: string;
  telegram: string;
  delivery: boolean;
  address: string;
  comment: string;
}

export function ExchangePage() {
  const { success, error } = useNotification();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [pairs, setPairs] = useState<ExchangePair[]>([
    { fromCurrency: '', toCurrency: '', fromAmount: 0, toAmount: 0 },
  ]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    whatsapp: '',
    telegram: '',
    delivery: false,
    address: '',
    comment: '',
  });

  // Добавление новой валютной пары
  const handleAddPair = () => {
    setPairs([...pairs, { fromCurrency: '', toCurrency: '', fromAmount: 0, toAmount: 0 }]);
  };

  // Удаление валютной пары
  const handleRemovePair = (index: number) => {
    const newPairs = [...pairs];
    newPairs.splice(index, 1);
    setPairs(newPairs);
  };

  // Обновление значения пары
  const handlePairChange = (index: number, field: keyof ExchangePair, value: string | number) => {
    const newPairs = [...pairs];
    newPairs[index] = { ...newPairs[index], [field]: value };

    // Здесь можно добавить логику расчета курса
    if (field === 'fromAmount' && newPairs[index].fromCurrency && newPairs[index].toCurrency) {
      // Пример расчета (в реальности будет использоваться API)
      newPairs[index].toAmount = Number(value) * 0.95; // Пример: курс с комиссией 5%
    } else if (field === 'toAmount' && newPairs[index].fromCurrency && newPairs[index].toCurrency) {
      // Расчет в обратную сторону
      newPairs[index].fromAmount = Number(value) / 0.95;
    }

    setPairs(newPairs);
  };

  // Обновление контактной информации
  const handleContactChange = (field: keyof ContactInfo, value: string | boolean) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  // Переход к шагу 2
  const handleContinue = () => {
    // Проверка валидности данных перед переходом
    const isValid = pairs.every(
      (pair) => pair.fromCurrency && pair.toCurrency && pair.fromAmount > 0
    );

    if (isValid) {
      setCurrentStep(2);
    } else {
      error('Пожалуйста, заполните все поля валютных пар корректно');
    }
  };

  // Возврат к шагу 1
  const handleBack = () => {
    setCurrentStep(1);
  };

  // Создание заказа
  const handleCreateOrder = () => {
    // Проверка обязательных полей
    if (!contactInfo.whatsapp && !contactInfo.telegram) {
      error('Укажите хотя бы один способ связи (WhatsApp или Telegram)');
      return;
    }

    if (contactInfo.delivery && !contactInfo.address) {
      error('При выборе доставки необходимо указать адрес');
      return;
    }

    try {
      // Здесь будет отправка данных на сервер
      success('Заказ успешно создан');
      // Здесь должен быть редирект на страницу с уникальной ссылкой
      // navigate(`/order/${orderId}`);

      // Временно перенаправляем на главную
      navigate('/');
    } catch (err: any) {
      error(err.message || 'Не удалось создать заказ');
    }
  };

  // Отмена и возврат на главную
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto">
        <PageTitle
          title="Заказать обмен"
          description={
            currentStep === 1
              ? 'Выберите валюты и введите суммы для обмена'
              : 'Укажите контактные данные для завершения заказа'
          }
        />

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {currentStep === 1 ? 'Шаг 1: Детали обмена' : 'Шаг 2: Контактная информация'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 ? (
              // Шаг 1: Выбор валют и сумм
              <div className="space-y-6">
                {pairs.map((pair, index) => (
                  <div key={index} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Отдаете*</label>
                        <div className="flex">
                          <select
                            value={pair.fromCurrency}
                            onChange={(e) => handlePairChange(index, 'fromCurrency', e.target.value)}
                            className="form-input rounded-r-none w-1/3 border-r-0"
                          >
                            <option value="">Выберите...</option>
                            {currencies.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.code} ({currency.symbol})
                              </option>
                            ))}
                          </select>
                          <Input
                            type="number"
                            value={pair.fromAmount || ''}
                            onChange={(e) => handlePairChange(index, 'fromAmount', Number(e.target.value))}
                            className="rounded-l-none w-2/3"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Получаете*</label>
                        <div className="flex">
                          <select
                            value={pair.toCurrency}
                            onChange={(e) => handlePairChange(index, 'toCurrency', e.target.value)}
                            className="form-input rounded-r-none w-1/3 border-r-0"
                          >
                            <option value="">Выберите...</option>
                            {currencies.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.code} ({currency.symbol})
                              </option>
                            ))}
                          </select>
                          <Input
                            type="number"
                            value={pair.toAmount || ''}
                            onChange={(e) => handlePairChange(index, 'toAmount', Number(e.target.value))}
                            className="rounded-l-none w-2/3"
                          />
                        </div>
                      </div>
                    </div>

                    {pairs.length > 1 && (
                      <div className="flex justify-end">
                        <Button
                          variant="secondary"
                          onClick={() => handleRemovePair(index)}
                          className="text-red-500"
                        >
                          Удалить
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-center">
                  <Button variant="secondary" onClick={handleAddPair} className="text-blue-500">
                    + Добавить обмен
                  </Button>
                </div>

                <div className="flex justify-between">
                  <Button variant="secondary" onClick={handleCancel} className="mr-2">
                    Отмена
                  </Button>
                  <Button variant="primary" onClick={handleContinue}>
                    Продолжить
                  </Button>
                </div>
              </div>
            ) : (
              // Шаг 2: Контактная информация
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Ваш заказ</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    {pairs.map((pair, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <span>
                          {pair.fromAmount} {pair.fromCurrency}
                        </span>
                        <span>→</span>
                        <span>
                          {pair.toAmount.toFixed(2)} {pair.toCurrency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">WhatsApp</label>
                    <Input
                      type="text"
                      value={contactInfo.whatsapp}
                      onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                      placeholder="+7 XXX XXX XX XX"
                    />
                  </div>
                  <div>
                    <label className="form-label">Telegram</label>
                    <Input
                      type="text"
                      value={contactInfo.telegram}
                      onChange={(e) => handleContactChange('telegram', e.target.value)}
                      placeholder="@username"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="delivery"
                    checked={contactInfo.delivery}
                    onChange={(e) => handleContactChange('delivery', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="delivery" className="form-label m-0">
                    Нужна доставка
                  </label>
                </div>

                {contactInfo.delivery && (
                  <div>
                    <label className="form-label">Адрес доставки</label>
                    <Input
                      type="text"
                      value={contactInfo.address}
                      onChange={(e) => handleContactChange('address', e.target.value)}
                      placeholder="Введите адрес доставки"
                    />
                  </div>
                )}

                <div>
                  <label className="form-label">Комментарий к заказу</label>
                  <textarea
                    value={contactInfo.comment}
                    onChange={(e) => handleContactChange('comment', e.target.value)}
                    placeholder="Дополнительная информация по заказу"
                    className="form-input"
                    rows={3}
                  />
                </div>

                <div className="flex justify-between">
                  <div className="space-x-4">
                    <Button variant="secondary" onClick={handleCancel} className="mr-2">
                      Отмена
                    </Button>
                    <Button variant="secondary" onClick={handleBack}>
                      Назад
                    </Button>
                  </div>
                  <Button variant="primary" onClick={handleCreateOrder}>
                    Создать заказ
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
