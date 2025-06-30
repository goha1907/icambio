# 💱 Обмен валют и управление курсами

Этот документ описывает функционал, связанный с управлением валютами, курсами обмена, обменными пунктами и их балансами в проекте `icambio`.

---

## 1. Обзор функционала

Приложение `exchange` в бэкенде и фича `exchange` во фронтенде отвечают за:

-   Управление списком доступных валют.
-   Определение и управление курсами обмена между валютами.
-   Расчет сумм к обмену/получению на основе курса.
-   Управление обменными пунктами (точками обмена).
-   Отслеживание балансов валют в каждом обменном пункте.

---

## 2. Стек технологий

-   **Бэкенд:** Django, Django Rest Framework.
-   **Фронтенд:** React, TypeScript, React Query (для работы с данными курсов и балансов).

---

## 3. Основные API-эндпоинты (Бэкенд)

### Валюты (`/api/currencies/`)
-   `GET /api/currencies/`: Получение списка всех валют.
-   `POST /api/currencies/`: Создание новой валюты (только для администраторов/владельцев).
-   `GET /api/currencies/{id}/`: Получение деталей валюты.
-   `PUT/PATCH /api/currencies/{id}/`: Обновление валюты (только для администраторов/владельцев).
-   `DELETE /api/currencies/{id}/`: Удаление валюты (только для администраторов/владельцев).

### Курсы обмена (`/api/exchange-rates/`)
-   `GET /api/exchange-rates/`: Получение списка активных курсов обмена.
-   `POST /api/exchange-rates/`: Создание нового курса (только для администраторов/владельцев).
-   `GET /api/exchange-rates/{id}/`: Получение деталей курса.
-   `PUT/PATCH /api/exchange-rates/{id}/`: Обновление курса (только для администраторов/владельцев).
-   `DELETE /api/exchange-rates/{id}/`: Удаление курса (только для администраторов/владельцев).
-   `POST /api/exchange-rates/{id}/calculate/`: Расчет суммы обмена/получения для конкретного курса. Принимает `amount_from` или `amount_to`.

### Обменные пункты (`/api/exchange-offices/`)
-   `GET /api/exchange-offices/`: Получение списка всех обменных пунктов.
-   `POST /api/exchange-offices/`: Создание нового обменного пункта (только для владельцев).
-   `GET /api/exchange-offices/{id}/`: Получение деталей обменного пункта.
-   `PUT/PATCH /api/exchange-offices/{id}/`: Обновление обменного пункта (только для владельцев).
-   `DELETE /api/exchange-offices/{id}/`: Удаление обменного пункта (только для владельцев).
-   `GET /api/exchange-offices/{id}/balances/`: Получение балансов валют для конкретного обменного пункта.

### Балансы валют (`/api/currency-balances/`)
-   `GET /api/currency-balances/`: Получение списка всех балансов валют.
-   `POST /api/currency-balances/`: Создание нового баланса (только для владельцев).
-   `GET /api/currency-balances/{id}/`: Получение деталей баланса.
-   `PUT/PATCH /api/currency-balances/{id}/`: Обновление баланса (только для владельцев).
-   `DELETE /api/currency-balances/{id}/`: Удаление баланса (только для владельцев).
-   `GET /api/currency-balances/by_office/`: Получение балансов по ID обменного пункта (с параметром `office_id`).

---

## 4. Модели данных (Бэкенд)

-   **`Currency`**: `exchange.models.Currency` (код, название, символ, decimal_places, is_active).
-   **`ExchangeRate`**: `exchange.models.ExchangeRate` (from_currency, to_currency, rate, min_amount, is_active).
-   **`ExchangeOffice`**: `exchange.models.ExchangeOffice` (name, address, latitude, longitude, is_active).
-   **`CurrencyBalance`**: `exchange.models.CurrencyBalance` (office, currency, balance).

---

## 5. Компоненты Фронтенда (Примеры)

-   `pages/exchange/ExchangePage.tsx`: Главная страница обмена.
-   `pages/exchange/OrderDetailsPage.tsx`: Страница деталей заказа.
-   `features/exchange/components/CurrencyPairForm.tsx`: Переиспользуемая форма для ввода валютной пары, используется как в калькуляторе обмена, так и на странице создания заявки.
-   `features/exchange/components/ExchangeRatesTable.tsx`: Таблица с отображением курсов обмена.
-   `features/home/components/ExchangeCalculator.tsx`: Калькулятор обмена на главной странице.

---

## 6. Состояние (Фронтенд)

-   **React Query:** Используется для получения и кеширования данных о валютах, курсах, обменных пунктах и их балансах (`useQuery`). Например, `features/exchange/hooks/useExchangeRate.ts`.
-   **Zustand:** Может использоваться для временного хранения данных формы обмена или выбора валют, если они нужны между разными компонентами или этапами. Это обеспечивает гибкое управление клиентским состоянием, не связанным с сервером.

## 📊 Таблица курсов обмена (ExchangeRatesTable)

### Обновленная структура таблицы

Таблица курсов обмена была переработана для улучшения пользовательского опыта:

#### Новая структура колонок
- **Отдаете** - валюта, которую пользователь отдает
- **Получаете** - валюта, которую пользователь получает  
- **Лимиты** - минимальные и максимальные суммы обмена
- **Курсы** - актуальные курсы обмена с отметками "горячих" предложений

#### Расширенная система фильтрации

Таблица теперь поддерживает мощную систему фильтрации:

```tsx
const filterConfigs: FilterConfig[] = [
  {
    key: 'fromCurrency',
    label: 'Отдаете',
    type: 'select',
    options: currencies.map(c => ({ value: c.code, label: c.code })),
    placeholder: 'Все валюты'
  },
  {
    key: 'toCurrency', 
    label: 'Получаете',
    type: 'select',
    options: currencies.map(c => ({ value: c.code, label: c.code })),
    placeholder: 'Все валюты'
  },
  {
    key: 'limits',
    label: 'Лимиты',
    type: 'number-range',
    placeholder: 'Диапазон сумм'
  },
  {
    key: 'isHot',
    label: 'Горячие предложения',
    type: 'select',
    options: [
      { value: 'true', label: 'Только горячие' },
      { value: 'false', label: 'Обычные' }
    ],
    placeholder: 'Все предложения'
  }
];
```

#### Встроенные фильтры в заголовках

Новая структура с фильтрами, встроенными прямо в заголовки колонок:

```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead 
        filterComponent={
          <Select 
            value={filters.fromCurrency || undefined} 
            onValueChange={(value) => handleFilterChange('fromCurrency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Все" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__clear__">Все</SelectItem>
              {currencies.from.map(currency => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        Отдаете
      </TableHead>
      
      <TableHead 
        filterComponent={
          <Select 
            value={filters.toCurrency || undefined} 
            onValueChange={(value) => handleFilterChange('toCurrency', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Все" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__clear__">Все</SelectItem>
              {currencies.to.map(currency => (
                <SelectItem key={currency} value={currency}>
                  {currency}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      >
        Получаете
      </TableHead>
      
      <TableHead 
        filterComponent={
          <Input
            type="number"
            placeholder="Введите сумму"
            value={filters.amount}
            onChange={(e) => handleFilterChange('amount', e.target.value)}
          />
        }
      >
        Сумма
      </TableHead>
      
      <TableHead>Курсы</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {filteredGroups.map((group) => (
      <TableRow key={group.id}>
        <TableCell>{group.fromCurrency}</TableCell>
        <TableCell>{group.toCurrency}</TableCell>
        <TableCell>
          {group.rates.map((rate, idx) => (
            <div key={idx}>
              До {rate.maxAmount.toLocaleString()} {group.fromCurrency}
            </div>
          ))}
        </TableCell>
        <TableCell>
          {group.rates.map((rate, idx) => (
            <div key={idx} className="flex items-center">
              <span className="font-mono">
                1 {group.fromCurrency} = {rate.rate} {group.toCurrency}
              </span>
              {rate.is_hot && <Badge variant="secondary">🔥</Badge>}
            </div>
          ))}
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Изменения в структуре:
- **Отдаете/Получаете** - разделили колонку "Направление обмена" на две отдельные
- **Сумма** - вместо "Лимиты", теперь пользователь вводит конкретную сумму для проверки доступности
- **Убрали фильтр "Горячие предложения"** - для упрощения интерфейса
- **Встроенные фильтры** - фильтры теперь находятся прямо в заголовках колонок

### Расширенные возможности Table

Компонент `ExchangeRatesTable` использует все новые возможности Table:

#### Сортировка курсов
```tsx
// Добавление сортировки по направлению обмена
<TableHead 
  sortable 
  sortDirection={sortField === 'direction' ? sortDirection : null}
  onSort={() => handleSort('direction')}
>
  Направление обмена
</TableHead>

// Сортировка по курсу
<TableHead 
  sortable 
  sortDirection={sortField === 'rate' ? sortDirection : null}
  onSort={() => handleSort('rate')}
>
  Курс
</TableHead>
```

#### Интерактивные строки
```tsx
// Выделение "горячих" курсов
<TableRow selected={rate.is_hot}>
  <TableCell>
    {rate.from_currency.code} → {rate.to_currency.code}
  </TableCell>
  <TableCell align="right" numeric>
    {rate.rate}
  </TableCell>
</TableRow>

// Кликабельные строки для быстрого создания заказа
<TableRow 
  clickable 
  onClick={() => createOrderWithRate(rate)}
>
  <TableCell>Нажмите для создания заказа</TableCell>
</TableRow>
```

#### Различные размеры для разных экранов
```tsx
// Компактная таблица для мобильных устройств
<Table size="sm" variant="striped" className="md:hidden">
  <TableHeader>
    <TableRow>
      <TableHead>Пара</TableHead>
      <TableHead>Курс</TableHead>
    </TableRow>
  </TableHeader>
</Table>

// Полная таблица для десктопа
<Table size="md" className="hidden md:block">
  <TableHeader sticky>
    <TableRow>
      <TableHead>Направление обмена</TableHead>
      <TableHead>Курсы и лимиты</TableHead>
      <TableHead>Действия</TableHead>
    </TableRow>
  </TableHeader>
</Table>
```

#### Подпись к таблице
```tsx
<Table>
  <TableCaption>
    Курсы обновляются каждые 30 секунд. 
    Последнее обновление: {lastUpdateTime}
  </TableCaption>
  <TableHeader>...</TableHeader>
</Table>
```

### Пример полной реализации

```tsx
const ExchangeRatesTable = () => {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return (
    <Table variant="striped">
      <TableCaption>
        Актуальные курсы валют на {new Date().toLocaleDateString()}
      </TableCaption>
      
      <TableHeader sticky>
        <TableRow>
          <TableHead 
            sortable 
            sortDirection={sortField === 'pair' ? sortDirection : null}
            onSort={() => handleSort('pair')}
          >
            Валютная пара
          </TableHead>
          <TableHead 
            sortable 
            sortDirection={sortField === 'rate' ? sortDirection : null}
            onSort={() => handleSort('rate')}
          >
            Курс
          </TableHead>
          <TableHead>Действия</TableHead>
        </TableRow>
      </TableHeader>
      
      <TableBody>
        {sortedRates.map((rate) => (
          <TableRow 
            key={rate.id}
            selected={rate.is_hot}
            clickable
            onClick={() => selectRate(rate)}
          >
            <TableCell>
              {rate.from_currency.code} → {rate.to_currency.code}
            </TableCell>
            <TableCell align="right" numeric>
              {rate.rate}
            </TableCell>
            <TableCell>
              <Button size="sm" onClick={() => createOrder(rate)}>
                Обменять
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      
      <TableFooter>
        <TableRow>
          <TableCell>Всего пар:</TableCell>
          <TableCell align="right">{rates.length}</TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}; 