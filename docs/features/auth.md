# 🔐 Аутентификация и управление пользователями

Этот документ описывает функционал аутентификации, регистрации и управления профилем пользователя в проекте `icambio`.

---

## 1. Обзор функционала

Приложение `users` в бэкенде и фича `auth` / `profile` во фронтенде отвечают за:

-   Регистрацию новых пользователей.
-   Аутентификацию (вход в систему).
-   Сброс и изменение пароля.
-   Получение и обновление данных профиля пользователя.
-   Управление реферальными кодами и ссылками.

---

## 2. Стек технологий

-   **Бэкенд:** Django, Django Rest Framework, `djoser`, `djangorestframework-simplejwt`.
-   **Фронтенд:** React, TypeScript, React Hook Form, Zod, Zustand (для хранения состояния аутентификации и данных пользователя после логина).

---

## 3. Процесс аутентификации (Supabase JWT)

1.  **Логин/Регистрация:** Фронтенд взаимодействует напрямую с Supabase для аутентификации пользователя (логин, регистрация, сброс пароля).
2.  **Получение токена:** В случае успеха Supabase возвращает JWT (JSON Web Token).
3.  **Хранение токена:** Фронтенд сохраняет этот токен (например, в `localStorage`) и управляет состоянием аутентификации через Zustand.
4.  **Взаимодействие с бэкендом:** При запросах к Django-бэкенду фронтенд прикрепляет JWT в виде `Authorization: Bearer <token>`.
5.  **Валидация на бэкенде:** Django-бэкенд **не генерирует** токены, а только **валидирует** входящие JWT, полученные от Supabase. Это обеспечивает защиту эндпоинтов.

---

## 4. Основные API-эндпоинты (Бэкенд)

-   `POST /auth/users/`: Регистрация пользователя.
-   `GET /auth/users/me/`: Получение данных профиля текущего пользователя.
-   `PUT/PATCH /auth/users/me/`: Обновление данных профиля текущего пользователя.
-   `POST /auth/users/set_password/`: Изменение пароля.
-   `POST /auth/users/reset_password/`: Запрос на сброс пароля (отправка email).
-   `POST /auth/users/reset_password_confirm/`: Подтверждение сброса пароля.
    *Примечание: Эндпоинты для получения и обновления JWT-токенов (`/jwt/create/`, `/jwt/refresh/`, `/jwt/blacklist/`) управляются напрямую через Supabase, и бэкенд только валидирует эти токены.*

---

## 5. Модели данных (Бэкенд)

-   **`User`**: Кастомная модель пользователя (`users.models.User`) с полями email (логин), username, telegram, whatsapp, referral_code, referred_by, bonus_balance.
-   `UserManager`: Кастомный менеджер для создания пользователей и суперпользователей.

---

## 6. Компоненты Фронтенда (Примеры)

-   `features/auth/components/LoginForm.tsx`: Форма входа.
-   `features/auth/components/RegisterForm.tsx`: Форма регистрации.
-   `features/auth/components/ChangePasswordForm.tsx`: Форма изменения пароля.
-   `features/auth/components/ResetPasswordForm.tsx`: Форма сброса пароля.
-   `features/profile/components/ProfileDetails.tsx`: Компонент для отображения и редактирования профиля.
-   `features/profile/components/ReferralProgram.tsx`: Компонент для отображения реферальной информации.
-   **Страницы:**
    -   `pages/auth/LoginPage.tsx`
    -   `pages/auth/RegisterPage.tsx`
    -   `pages/auth/ChangePasswordPage.tsx`
    -   `pages/auth/ResetPasswordPage.tsx`

---

## 7. Состояние (Фронтенд)

-   **Zustand:** Хранит состояние аутентификации (например, статус `isAuth`, данные пользователя после логина).
-   **React Query:** Используется для асинхронных запросов к API, кеширования и управления серверным состоянием (например, получение и обновление данных пользователя).

## 🛡️ Защита маршрутов (ProtectedRoute)

### Базовое использование

Компонент `ProtectedRoute` автоматически проверяет аутентификацию пользователя и при необходимости перенаправляет на страницу входа:

```tsx
// В конфигурации маршрутов
const protectedRoutes: RouteObject[] = [
  {
    path: '',
    element: <ProtectedRoute />,
    children: [
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/edit', element: <EditProfilePage /> },
    ],
  },
];
```

### Проверка ролей пользователей

Для ограничения доступа по ролям:

```tsx
// Только для администраторов
<ProtectedRoute 
  requiredRoles={['admin']}
  showDetailedErrors={true}
/>

// Для администраторов и модераторов
<ProtectedRoute 
  requiredRoles={['admin', 'moderator']}
/>
```

### Настройка ролей в Supabase

Роли пользователей должны храниться в `user_metadata`:

```javascript
// При регистрации или обновлении профиля
await supabase.auth.updateUser({
  data: {
    roles: ['user'] // или ['admin', 'moderator']
  }
});
```

### Кастомизация

```tsx
// Кастомный редирект
<ProtectedRoute redirectTo="/auth/signin" />

// Кастомное состояние загрузки
<ProtectedRoute 
  fallback={<CustomLoadingSpinner />}
/>

// Кастомная страница отказа в доступе
<ProtectedRoute 
  accessDeniedComponent={<CustomAccessDenied />}
/>
```

## 👤 Интерфейс профиля пользователя (ProfilePage)

### Новые возможности TabPanel

Страница профиля теперь использует улучшенный компонент `TabPanel` с иконками и расширенными возможностями:

#### Вкладки с иконками
```tsx
import { User, History, Users } from 'lucide-react';

<TabsList>
  <TabsTrigger value="profile" icon={<User className="h-4 w-4" />}>
    Профиль
  </TabsTrigger>
  <TabsTrigger value="history" icon={<History className="h-4 w-4" />}>
    История обменов
  </TabsTrigger>
  <TabsTrigger value="referral" icon={<Users className="h-4 w-4" />}>
    Реферальная программа
  </TabsTrigger>
</TabsList>
```

#### Различные стили для разных контекстов
```tsx
// Компактные вкладки для мобильных устройств
<TabsList variant="pills" size="sm" className="md:hidden">
  <TabsTrigger value="profile" icon={<User />} iconOnly />
  <TabsTrigger value="history" icon={<History />} iconOnly />
  <TabsTrigger value="referral" icon={<Users />} iconOnly />
</TabsList>

// Полные вкладки для десктопа
<TabsList className="hidden md:flex">
  <TabsTrigger value="profile" icon={<User className="h-4 w-4" />}>
    Профиль
  </TabsTrigger>
  <TabsTrigger value="history" icon={<History className="h-4 w-4" />}>
    История обменов
  </TabsTrigger>
</TabsList>
```

#### Синхронизация с URL
```tsx
const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Получаем активную вкладку из URL параметров
  const activeTab = new URLSearchParams(location.search).get('tab') || 'profile';

  // Обновляем URL при смене вкладки
  const handleTabChange = (tabId: string) => {
    navigate(`/profile?tab=${tabId}`, { replace: true });
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange}>
      <TabsList>
        <TabsTrigger value="profile" icon={<User className="h-4 w-4" />}>
          Профиль
        </TabsTrigger>
        <TabsTrigger value="history" icon={<History className="h-4 w-4" />}>
          История обменов
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile">
        <ProfileDetails user={user} />
      </TabsContent>
      
      <TabsContent value="history">
        <ExchangeHistory exchanges={exchanges} />
      </TabsContent>
    </Tabs>
  );
};
```

#### Состояния загрузки
```tsx
// Показываем индикатор загрузки при получении данных
<TabsTrigger 
  value="history" 
  icon={<History className="h-4 w-4" />}
  loading={isLoadingHistory}
>
  История обменов
</TabsTrigger>
```

#### Вертикальные вкладки для настроек
```tsx
// Для страниц с множественными настройками
<div className="flex gap-6">
  <TabsList orientation="vertical">
    <TabsTrigger value="general" icon={<Settings />}>
      Общие
    </TabsTrigger>
    <TabsTrigger value="security" icon={<Shield />}>
      Безопасность
    </TabsTrigger>
    <TabsTrigger value="notifications" icon={<Bell />}>
      Уведомления
    </TabsTrigger>
    <TabsTrigger value="privacy" icon={<Lock />}>
      Приватность
    </TabsTrigger>
  </TabsList>
  
  <div className="flex-1">
    <TabsContent value="general" padded>
      <GeneralSettings />
    </TabsContent>
    <TabsContent value="security" padded>
      <SecuritySettings />
    </TabsContent>
  </div>
</div>
```

### Преимущества нового подхода

1. **Улучшенная навигация**: Иконки делают вкладки более узнаваемыми
2. **Responsive дизайн**: Разные стили для мобильных и десктопных устройств
3. **URL синхронизация**: Прямые ссылки на конкретные разделы профиля
4. **Accessibility**: Правильная поддержка клавиатурной навигации и screen readers
5. **Состояния загрузки**: Визуальная обратная связь при асинхронных операциях 

# Аутентификация (Authentication)

Система аутентификации построена на основе Supabase Auth и обеспечивает полный цикл управления пользователями.

## Архитектура

### Компоненты аутентификации

#### LoginForm.tsx ✅ (Рефакторинг завершен)
**Статус:** Полностью обновлен с улучшенным UX и функциональностью

**Ключевые улучшения:**
- 🔐 **Показать/скрыть пароль** с иконками Eye/EyeOff
- 💾 **"Запомнить меня"** - сохранение email в localStorage
- 🎯 **Автофокус** на поле email при загрузке
- 🔄 **Автозаполнение** сохраненных данных
- ⚡ **Улучшенная обработка ошибок** с детальными сообщениями
- ♿ **Accessibility** - aria-labels, aria-invalid, правильная связь с ошибками
- 🎨 **Современный дизайн** с анимированными иконками и состояниями
- 📱 **Адаптивность** и правильное поведение на мобильных

**Технические детали:**
- Валидация `onBlur` для лучшего UX
- Автоматическая очистка ошибок при изменении полей
- Правильная типизация с TypeScript
- Использование Zod схем для валидации
- Интеграция с React Hook Form

**Новые возможности:**
- Сохранение email между сессиями
- Визуальные индикаторы загрузки с Loader2
- Ссылки на правила обмена и AML/KYC политику
- Обработка различных типов ошибок от Supabase

#### RegisterForm.tsx
**Статус:** Требует рефакторинга
- Базовая функциональность регистрации
- Валидация полей
- Интеграция с Supabase Auth

#### ResetPasswordForm.tsx
**Статус:** Требует рефакторинга
- Форма запроса сброса пароля
- Отправка email для восстановления

#### ChangePasswordForm.tsx
**Статус:** Требует рефакторинга
- Смена пароля для авторизованных пользователей
- Валидация старого пароля

#### SetNewPasswordForm.tsx
**Статус:** Требует рефакторинга
- Установка нового пароля по ссылке из email
- Валидация токена восстановления

### Хуки (Hooks)

#### useAuth.ts
**Основной хук для работы с аутентификацией:**
- `login(credentials)` - вход в систему
- `register(userData)` - регистрация
- `logout()` - выход из системы
- `resetPassword(email)` - сброс пароля
- `changePassword(oldPassword, newPassword)` - смена пароля
- `isLoading` - состояние загрузки
- `user` - текущий пользователь

### Сторы (State Management)

#### useAuthStore.ts (Zustand)
**Глобальное состояние аутентификации:**
- `user` - данные пользователя
- `isAuthenticated` - статус авторизации
- `token` - JWT токен
- `setUser()` - установка пользователя
- `clearAuth()` - очистка состояния

### Сервисы (Services)

#### authService.ts
**API вызовы для аутентификации:**
- Интеграция с Supabase Auth
- Обработка JWT токенов
- Валидация на стороне сервера

## Процесс аутентификации

### 1. Вход в систему (Login)
```typescript
const { login, isLoading } = useAuth();

const handleLogin = async (data: LoginFormData) => {
  const result = await login(data);
  if (result.error) {
    // Обработка ошибки
  } else {
    // Успешный вход
    navigate('/');
  }
};
```

### 2. Регистрация (Register)
```typescript
const { register, isLoading } = useAuth();

const handleRegister = async (data: RegisterFormData) => {
  const result = await register(data);
  if (result.error) {
    // Обработка ошибки
  } else {
    // Успешная регистрация
    navigate('/confirm-email');
  }
};
```

### 3. Защищенные маршруты
```typescript
<ProtectedRoute 
  requiredRoles={['user']}
  redirectTo="/login"
  accessDeniedComponent={<AccessDenied />}
>
  <ProfilePage />
</ProtectedRoute>
```

## Валидация

### Схемы валидации (Zod)
```typescript
// Логин
export const loginSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Минимум 6 символов')
});

// Регистрация
export const registerSchema = z.object({
  email: z.string().email('Некорректный email'),
  password: z.string().min(8, 'Минимум 8 символов'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"]
});
```

## Безопасность

### JWT Токены
- Автоматическое добавление в заголовки запросов
- Обновление токенов через Supabase
- Безопасное хранение в памяти (не в localStorage)

### Защита маршрутов
- Компонент `ProtectedRoute` для защищенных страниц
- Проверка ролей пользователей
- Редирект на страницу входа для неавторизованных

### Валидация на сервере
- Django middleware для проверки JWT
- Интеграция с Supabase для валидации токенов
- Защита API эндпоинтов

## Обработка ошибок

### Типы ошибок
- Неверные учетные данные
- Неподтвержденный email
- Заблокированный аккаунт
- Сетевые ошибки
- Ошибки валидации

### UX для ошибок
- Понятные сообщения на русском языке
- Визуальные индикаторы (Alert компоненты)
- Автоматическая очистка ошибок при изменении полей
- Предложения по исправлению

## Планы развития

### Ближайшие задачи
1. **Рефакторинг остальных форм** - RegisterForm, ResetPasswordForm, etc.
2. **Двухфакторная аутентификация** - SMS/Email коды
3. **Социальные сети** - вход через Google, Yandex
4. **Улучшение безопасности** - rate limiting, CAPTCHA

### Долгосрочные цели
- Биометрическая аутентификация
- SSO интеграция
- Аудит безопасности
- Мониторинг подозрительной активности

## Тестирование

### Unit тесты
- Валидация форм
- Хуки аутентификации
- Сервисы API

### E2E тесты
- Полный цикл регистрации
- Вход/выход из системы
- Восстановление пароля

### Безопасность
- Тестирование на проникновение
- Валидация JWT токенов
- Проверка защищенных маршрутов 