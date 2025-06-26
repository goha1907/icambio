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