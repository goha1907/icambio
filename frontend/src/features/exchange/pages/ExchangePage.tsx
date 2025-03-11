import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { PageTitle } from '@/shared/ui/PageTitle';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { useNotification } from '@/lib/hooks/useNotification';
import { mockCurrencies, calculateToAmount, calculateFromAmount } from '@/mocks/exchange-data';
import { logger } from '@/lib/utils/logger';

export function ExchangePage() {
  const { success, error } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Инициализируем состояние с пустыми значениями
  const [pairs, setPairs] = useState([
    { fromCurrency: '', toCurrency: '', fromAmount: 0, toAmount: 0 }
  ]);
  
  // Загружаем данные из localStorage при монтировании компонента
  useEffect(() => {
    const savedDataJson = localStorage.getItem('exchangeCalculatorData');
    if (savedDataJson) {
      try {
        const savedData = JSON.parse(savedDataJson);
        
        // Проверяем данные
        if (savedData && savedData.fromCurrency && savedData.toCurrency) {
          setPairs([{
            fromCurrency: savedData.fromCurrency,
            toCurrency: savedData.toCurrency,
            fromAmount: Number(savedData.fromAmount) || 0,
            toAmount: Number(savedData.toAmount) || 0
          }]);
          
          // Очищаем localStorage после использования
          localStorage.removeItem('exchangeCalculatorData');
        }
      } catch (e) {
        logger.error('Error parsing exchangeCalculatorData', e);
      }
    }
  }, []);
  
  const [contactInfo, setContactInfo] = useState({
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
  const handlePairChange = (index: number, field: string, value: string | number) => {
    const newPairs = [...pairs];
    const pair = { ...newPairs[index], [field]: value };
    
    // Автоматический расчет при изменении валюты или суммы
    if (field === 'fromAmount' && pair.fromCurrency && pair.toCurrency) {
      const calculated = calculateToAmount(pair.fromCurrency, pair.toCurrency, Number(value));
      if (calculated !== null) {
        pair.toAmount = calculated;
      }
    } else if (field === 'toAmount' && pair.fromCurrency && pair.toCurrency) {
      const calculated = calculateFromAmount(pair.fromCurrency, pair.toCurrency, Number(value));
      if (calculated !== null) {
        pair.fromAmount = calculated;
      }
    } else if ((field === 'fromCurrency' || field === 'toCurrency') && 
               pair.fromCurrency && pair.toCurrency && pair.fromAmount > 0) {
      const calculated = calculateToAmount(pair.fromCurrency, pair.toCurrency, pair.fromAmount);
      if (calculated !== null) {
        pair.toAmount = calculated;
      }
    }
    
    newPairs[index] = pair;
    setPairs(newPairs);
  };

  // Обновление контактной информации
  const handleContactChange = (field: string, value: string | boolean) => {
    setContactInfo({ ...contactInfo, [field]: value });
  };

  // Переход к шагу 2
  const handleContinue = () => {
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
    } catch (err: any) {
      error(err.message || 'Не удалось создать заказ');
    }
  };

  // Отмена и возврат на главную
  const handleCancel = () => {
    window.history.back();
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Отдаете*
                        </label>
                        <div className="flex">
                          <select
                            value={pair.fromCurrency}
                            onChange={(e) => handlePairChange(index, 'fromCurrency', e.target.value)}
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
                            onChange={(e) => handlePairChange(index, 'fromAmount', Number(e.target.value))}
                            className="rounded-l-none w-2/3"
                            min="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Получаете*
                        </label>
                        <div className="flex">
                          <select
                            value={pair.toCurrency}
                            onChange={(e) => handlePairChange(index, 'toCurrency', e.target.value)}
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
                            onChange={(e) => handlePairChange(index, 'toAmount', Number(e.target.value))}
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
                          {pair.toAmount} {pair.toCurrency}
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
                      helperText="Введите номер телефона с кодом страны"
                    />
                  </div>
                  <div>
                    <label className="form-label">Telegram</label>
                    <Input
                      type="text"
                      value={contactInfo.telegram}
                      onChange={(e) => handleContactChange('telegram', e.target.value)}
                      placeholder="@username"
                      helperText="Введите ваш @username в Telegram"
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