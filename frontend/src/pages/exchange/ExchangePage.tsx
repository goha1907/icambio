import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useNotification } from '@/lib/hooks/useNotification';

// Temporary mock data until DB connection is ready
const mockCurrencies = [
  { code: 'USDT', symbol: '$', name: 'Tether' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'BTC', symbol: '₿', name: 'Bitcoin' },
  { code: 'ETH', symbol: 'Ξ', name: 'Ethereum' },
];

const calculateToAmount = (fromCurrency: string, toCurrency: string, fromAmount: number) => {
  // Mock calculation - replace with real API call when ready
  const mockRates: Record<string, Record<string, number>> = {
    'USDT': { 'ARS': 950, 'USD': 0.99, 'BTC': 0.000023, 'ETH': 0.00038 },
    'USD': { 'ARS': 960, 'USDT': 1.01, 'BTC': 0.000023, 'ETH': 0.00038 },
    'ARS': { 'USDT': 0.00105, 'USD': 0.00104, 'BTC': 0.000000024, 'ETH': 0.0000004 },
    'BTC': { 'USDT': 43500, 'USD': 43000, 'ARS': 41280000, 'ETH': 16.5 },
    'ETH': { 'USDT': 2630, 'USD': 2600, 'ARS': 2496000, 'BTC': 0.061 },
  };
  
  const rate = mockRates[fromCurrency]?.[toCurrency];
  return rate ? fromAmount * rate : null;
};

const calculateFromAmount = (fromCurrency: string, toCurrency: string, toAmount: number) => {
  // Mock calculation - replace with real API call when ready
  const mockRates: Record<string, Record<string, number>> = {
    'USDT': { 'ARS': 950, 'USD': 0.99, 'BTC': 0.000023, 'ETH': 0.00038 },
    'USD': { 'ARS': 960, 'USDT': 1.01, 'BTC': 0.000023, 'ETH': 0.00038 },
    'ARS': { 'USDT': 0.00105, 'USD': 0.00104, 'BTC': 0.000000024, 'ETH': 0.0000004 },
    'BTC': { 'USDT': 43500, 'USD': 43000, 'ARS': 41280000, 'ETH': 16.5 },
    'ETH': { 'USDT': 2630, 'USD': 2600, 'ARS': 2496000, 'BTC': 0.061 },
  };
  
  const rate = mockRates[fromCurrency]?.[toCurrency];
  return rate ? toAmount / rate : null;
};

export function ExchangePage() {
  const { success, error } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const [pairs, setPairs] = useState([
    { fromCurrency: '', toCurrency: '', fromAmount: 0, toAmount: 0 },
  ]);

  // Load draft data from localStorage on mount
  useEffect(() => {
    try {
      const savedDataJson = localStorage.getItem('exchangeCalculatorData');
      if (savedDataJson) {
        console.log(`Loading saved data: ${savedDataJson}`);
        try {
          const savedData = JSON.parse(savedDataJson);
          if (
            savedData &&
            typeof savedData === 'object' &&
            'fromCurrency' in savedData &&
            'toCurrency' in savedData &&
            'fromAmount' in savedData &&
            'toAmount' in savedData
          ) {
            setPairs([
              {
                fromCurrency: savedData.fromCurrency,
                toCurrency: savedData.toCurrency,
                fromAmount: Number(savedData.fromAmount),
                toAmount: Number(savedData.toAmount),
              },
            ]);
            localStorage.removeItem('exchangeCalculatorData');
          }
        } catch (parseErr) {
          console.error(`Error parsing saved data: ${parseErr}`);
        }
      }
    } catch (e) {
      console.error('Error loading exchange data', e);
      error('Произошла ошибка при загрузке данных обмена');
    }
  }, [error]);

  const [contactInfo, setContactInfo] = useState({
    whatsapp: '',
    telegram: '',
    delivery: false,
    address: '',
    comment: '',
  });

  // Pair helpers
  const handleAddPair = () => {
    setPairs([...pairs, { fromCurrency: '', toCurrency: '', fromAmount: 0, toAmount: 0 }]);
  };

  const handleRemovePair = (index: number) => {
    const newPairs = [...pairs];
    newPairs.splice(index, 1);
    setPairs(newPairs);
  };

  const handlePairChange = (
    index: number,
    field: string,
    value: string | number,
  ) => {
    const newPairs = [...pairs];
    const pair = { ...newPairs[index], [field]: value } as typeof newPairs[number];

    // Auto-calculations
    if (field === 'fromAmount' && pair.fromCurrency && pair.toCurrency) {
      const calc = calculateToAmount(pair.fromCurrency, pair.toCurrency, Number(value));
      if (calc !== null) pair.toAmount = calc;
    } else if (field === 'toAmount' && pair.fromCurrency && pair.toCurrency) {
      const calc = calculateFromAmount(pair.fromCurrency, pair.toCurrency, Number(value));
      if (calc !== null) pair.fromAmount = calc;
    } else if (
      (field === 'fromCurrency' || field === 'toCurrency') &&
      pair.fromCurrency &&
      pair.toCurrency &&
      pair.fromAmount > 0
    ) {
      const calc = calculateToAmount(pair.fromCurrency, pair.toCurrency, pair.fromAmount);
      if (calc !== null) pair.toAmount = calc;
    }

    newPairs[index] = pair;
    setPairs(newPairs);
  };

  // Contact helpers
  const handleContactChange = (field: string, value: string | boolean) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  // Navigation helpers
  const handleContinue = () => {
    const valid = pairs.every(
      (p) => p.fromCurrency && p.toCurrency && p.fromAmount > 0,
    );
    valid ? setCurrentStep(2) : error('Пожалуйста, заполните все поля валютных пар корректно');
  };

  const handleBack = () => setCurrentStep(1);

  // Submit order
  const handleCreateOrder = () => {
    if (!contactInfo.whatsapp && !contactInfo.telegram) {
      error('Укажите хотя бы один способ связи (WhatsApp или Telegram)');
      return;
    }
    if (contactInfo.delivery && !contactInfo.address) {
      error('При выборе доставки необходимо указать адрес');
      return;
    }

    try {
      success('Заказ успешно создан');
      // TODO: redirect to order page
    } catch (err: unknown) {
      error(err instanceof Error ? err.message : 'Не удалось создать заказ');
    }
  };

  const handleCancel = () => window.history.back();

  // ---- UI ----
  return (
    <div className="page-container">
      <div className="component-container">
        <PageTitle
          title="Заказать обмен"
          description={
            currentStep === 1
              ? 'Выберите валюты и введите суммы для обмена'
              : 'Укажите контактные данные для завершения заказа'
          }
        />

        <Card className="w-full bg-white">
          <CardHeader>
            <CardTitle>
              {currentStep === 1
                ? 'Шаг 1: Детали обмена'
                : 'Шаг 2: Контактная информация'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentStep === 1 ? (
              /* Шаг 1: выбор валют */
              <div className="space-y-6">
                {pairs.map((pair, index) => (
                  <div key={index} className="space-y-4">
                    {/* From / To selectors */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* FROM */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Отдаете*
                        </label>
                        <div className="flex">
                          <select
                            value={pair.fromCurrency}
                            onChange={(e) =>
                              handlePairChange(index, 'fromCurrency', e.target.value)
                            }
                            className="form-input rounded-r-none w-1/3 border-r-0"
                          >
                            <option value="">Выберите...</option>
                            {mockCurrencies.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.code} ({currency.symbol})
                              </option>
                            ))}
                          </select>
                          <Input
                            type="number"
                            value={pair.fromAmount || ''}
                            onChange={(e) =>
                              handlePairChange(index, 'fromAmount', Number(e.target.value))
                            }
                            className="rounded-l-none w-2/3"
                            min="0"
                          />
                        </div>
                      </div>
                      {/* TO */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Получаете*
                        </label>
                        <div className="flex">
                          <select
                            value={pair.toCurrency}
                            onChange={(e) =>
                              handlePairChange(index, 'toCurrency', e.target.value)
                            }
                            className="form-input rounded-r-none w-1/3 border-r-0"
                          >
                            <option value="">Выберите...</option>
                            {mockCurrencies.map((currency) => (
                              <option key={currency.code} value={currency.code}>
                                {currency.code} ({currency.symbol})
                              </option>
                            ))}
                          </select>
                          <Input
                            type="number"
                            value={pair.toAmount || ''}
                            onChange={(e) =>
                              handlePairChange(index, 'toAmount', Number(e.target.value))
                            }
                            className="rounded-l-none w-2/3"
                            min="0"
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
              /* Шаг 2: Контакты */
              <div className="space-y-6">
                {/* Order summary */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Ваш заказ</h3>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    {pairs.map((pair, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                      >
                        <span className="font-medium">
                          {pair.fromAmount} {pair.fromCurrency}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="font-medium">
                          {pair.toAmount} {pair.toCurrency}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Contacts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        WhatsApp
                        <span className="text-gray-500 text-xs ml-1">(опционально)</span>
                      </label>
                      <Input
                        type="text"
                        value={contactInfo.whatsapp}
                        onChange={(e) => handleContactChange('whatsapp', e.target.value)}
                        placeholder="+7 999 123-45-67"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telegram
                        <span className="text-gray-500 text-xs ml-1">(опционально)</span>
                      </label>
                      <Input
                        type="text"
                        value={contactInfo.telegram}
                        onChange={(e) => handleContactChange('telegram', e.target.value)}
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="delivery"
                        checked={contactInfo.delivery}
                        onChange={(e) => handleContactChange('delivery', e.target.checked)}
                        className="h-4 w-4 text-icmop-primary focus:ring-icmop-primary border-gray-300 rounded"
                      />
                      <label htmlFor="delivery" className="ml-2 block text-sm text-gray-900">
                        Нужна доставка
                      </label>
                    </div>
                    {contactInfo.delivery && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Адрес доставки*
                        </label>
                        <Input
                          type="text"
                          value={contactInfo.address}
                          onChange={(e) => handleContactChange('address', e.target.value)}
                          placeholder="Введите адрес доставки"
                        />
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Комментарий
                        <span className="text-gray-500 text-xs ml-1">(опционально)</span>
                      </label>
                      <textarea
                        value={contactInfo.comment}
                        onChange={(e) => handleContactChange('comment', e.target.value)}
                        rows={3}
                        className="form-input w-full rounded-md"
                        placeholder="Дополнительная информация..."
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between pt-4">
                  <Button variant="secondary" onClick={handleBack} className="mr-2">
                    Назад
                  </Button>
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