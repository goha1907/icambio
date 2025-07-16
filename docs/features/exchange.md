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

### Валюты (`/api/v1/currencies/`)
-   `GET /api/v1/currencies/`: Получение списка всех валют.
-   `POST /api/v1/currencies/`: Создание новой валюты (только для администраторов/владельцев).
-   `GET /api/v1/currencies/{id}/`: Получение деталей валюты.
-   `PUT/PATCH /api/v1/currencies/{id}/`: Обновление валюты (только для администраторов/владельцев).
-   `DELETE /api/v1/currencies/{id}/`: Удаление валюты (только для администраторов/владельцев).

### Курсы обмена (`/api/v1/exchange-rates/`)
-   `GET /api/v1/exchange-rates/`: Получение списка активных курсов обмена.
-   `POST /api/v1/exchange-rates/`: Создание нового курса (только для администраторов/владельцев).
-   `GET /api/v1/exchange-rates/{id}/`: Получение деталей курса.
-   `PUT/PATCH /api/v1/exchange-rates/{id}/`: Обновление курса (только для администраторов/владельцев).
-   `DELETE /api/v1/exchange-rates/{id}/`: Удаление курса (только для администраторов/владельцев).
-   `POST /api/v1/exchange-rates/{id}/calculate/`: Расчет суммы обмена/получения для конкретного курса. Принимает `amount_from` или `amount_to`.

### Филиалы (`/api/v1/branches/`)
-   `GET /api/v1/branches/`: Получение списка всех филиалов.
-   `POST /api/v1/branches/`: Создание нового филиала (только для владельцев).
-   `GET /api/v1/branches/{id}/`: Получение деталей филиала.
-   `PUT/PATCH /api/v1/branches/{id}/`: Обновление филиала (только для владельцев).
-   `DELETE /api/v1/branches/{id}/`: Удаление филиала (только для владельцев).
-   `GET /api/v1/branches/{id}/currencies/`: Получение балансов валют для конкретного филиала.

### Балансы валют (`/api/v1/branch-currencies/`)
-   `GET /api/v1/branch-currencies/`: Получение списка всех балансов валют (только для владельцев).
-   `POST /api/v1/branch-currencies/`: Создание нового баланса (только для владельцев).
-   `GET /api/v1/branch-currencies/{id}/`: Получение деталей баланса (только для владельцев).
-   `PUT/PATCH /api/v1/branch-currencies/{id}/`: Обновление баланса (только для владельцев).
-   `DELETE /api/v1/branch-currencies/{id}/`: Удаление баланса (только для владельцев).
-   `GET /api/v1/branch-currencies/by_branch/`: Получение балансов по ID филиала (с параметром `branch_id`).

---

## 4. Модели данных (Бэкенд)

-   **`Currency`**: `exchange.models.Currency` (код, название, символ, decimal_places).
-   **`ExchangeRate`**: `exchange.models.ExchangeRate` (branch, currency_from, currency_to, rate, min_amount, max_amount, is_hot, visible, in_filter).
-   **`Branch`**: `branches.models.Branch` (name, email, whatsapp, telegram, instagram, address, is_active).
-   **`BranchCurrency`**: `branches.models.BranchCurrency` (branch, currency, amount).
-   **`Address`**: `core.models.Address` (country, city, street, house_number, postal_code, full_address, latitude, longitude).

---

## 5. Компоненты Фронтенда

### ExchangeRatesTable

Компонент для отображения курсов валют в виде таблицы с фильтрацией и сортировкой.

#### Основные возможности:
- **Фильтрация** по валютам и суммам
- **Сортировка** по любому столбцу
- **Пагинация** для больших списков
- **Адаптивность** для мобильных устройств
- **Интерактивность** - клик по строке для создания заказа

#### Пример использования:
```tsx
import { ExchangeRatesTable } from '@/features/exchange/components/ExchangeRatesTable';

const ExchangePage = () => {
  return (
    <div>
      <h1>Курсы валют</h1>
      <ExchangeRatesTable />
    </div>
  );
};
```

### CurrencyExchangeForm

Форма для создания заказа на обмен валют.

#### Основные возможности:
- **Выбор валют** с автодополнением
- **Расчет суммы** в реальном времени
- **Валидация** на клиенте и сервере
- **Сохранение черновика** в localStorage

### ExchangeCalculator

Калькулятор для расчета обмена валют.

#### Основные возможности:
- **Быстрый расчет** без создания заказа
- **История расчетов** в сессии
- **Сравнение курсов** разных филиалов

---

## 6. Состояние (Фронтенд)

- **React Query:** Используется для получения и кеширования данных о валютах, курсах, обменных пунктах и их балансах (`useQuery`). Например, `features/exchange/hooks/useExchangeRate.ts`.
- **Zustand:** Может использоваться для временного хранения данных формы обмена или выбора валют, если они нужны между разными компонентами или этапами. Это обеспечивает гибкое управление клиентским состоянием, не связанным с сервером. 