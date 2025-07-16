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

-   **Бэкенд:** Django, Django Rest Framework, Django Allauth, DRF Simple JWT.
-   **Фронтенд:** React, TypeScript, React Hook Form, Zod, Zustand (для хранения состояния аутентификации и данных пользователя после логина).

---

## 3. Процесс аутентификации (Django Allauth + JWT)

1.  **Логин/Регистрация:** Фронтенд взаимодействует с Django API для аутентификации пользователя.
2.  **Получение токена:** Django генерирует JWT токены через DRF Simple JWT.
3.  **Хранение токена:** Фронтенд сохраняет полученный токен (например, в `localStorage`) и управляет состоянием аутентификации через Zustand.
4.  **Взаимодействие с бэкендом:** При запросах к Django-бэкенду фронтенд прикрепляет JWT в виде `Authorization: Bearer <token>`.
5.  **Валидация на бэкенде:** Django-бэкенд валидирует входящие JWT токены и обеспечивает защиту эндпоинтов.

---

## 4. Основные API-эндпоинты (Бэкенд)

### Аутентификация
-   `POST /api/auth/register/`: Регистрация пользователя.
-   `POST /api/auth/login/`: Вход пользователя.
-   `POST /api/auth/logout/`: Выход пользователя.
-   `POST /api/auth/refresh/`: Обновление JWT токена.
-   `POST /api/auth/password/reset/`: Запрос на сброс пароля (отправка email).
-   `POST /api/auth/password/reset/confirm/`: Подтверждение сброса пароля.
-   `POST /api/auth/password/change/`: Изменение пароля (для аутентифицированных пользователей).

### Профиль пользователя
-   `GET /api/users/me/`: Получение данных профиля текущего пользователя.
-   `PUT/PATCH /api/users/me/`: Обновление данных профиля текущего пользователя.
-   `GET /api/users/`: Получение списка пользователей (только для администраторов).
-   `GET /api/users/{id}/`: Получение данных пользователя по ID (только для администраторов).
-   `PUT/PATCH /api/users/{id}/`: Обновление данных пользователя (только для администраторов).
-   `DELETE /api/users/{id}/`: Удаление пользователя (только для администраторов).

---

## 5. Модели данных (Бэкенд)

-   **`User`**: Кастомная модель пользователя (`users.models.User`) с полями:
    - `id`: UUID первичный ключ
    - `email`: Email пользователя (логин)
    - `username`: Имя пользователя
    - `first_name`, `last_name`: Имя и фамилия
    - `whatsapp`, `telegram`: Контактные данные
    - `referral_code`: Уникальный реферальный код
    - `referred_by_code`: Код пригласившего пользователя
    - `referral_amount`: Сумма реферальных бонусов
    - `address_id`: Ссылка на адрес
    - `role`: Роль пользователя (user, admin, moderator)
    - `created_at`: Дата создания

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

### Настройка ролей в Django

Роли пользователей хранятся в поле `role` модели User:

```python
# В Django модели
class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
        ('moderator', 'Moderator'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
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



## 🔐 Управление токенами

### Хранение токенов
```tsx
// В Zustand store
interface AuthStore {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuth: boolean;
  
  setTokens: (access: string, refresh: string) => void;
  clearTokens: () => void;
  logout: () => void;
}
```

### Автоматическое обновление токенов
```tsx
// В axios interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Попытка обновить токен
      const refreshToken = authStore.getState().refreshToken;
      if (refreshToken) {
        try {
          const response = await api.post('/auth/refresh/', {
            refresh: refreshToken
          });
          authStore.getState().setTokens(
            response.data.access,
            response.data.refresh
          );
          // Повторяем оригинальный запрос
          return api.request(error.config);
        } catch (refreshError) {
          // Токен не обновился, разлогиниваем
          authStore.getState().logout();
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);
```

## 📧 Email уведомления

### Настройка email
```python
# settings.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL')
```

### Шаблоны email
Django Allauth предоставляет готовые шаблоны для:
- Подтверждения регистрации
- Сброса пароля
- Изменения email
- Уведомлений о входе

## 🔒 Безопасность

### JWT настройки
```python
# settings.py
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
}
```

### CORS настройки
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
CORS_ALLOW_CREDENTIALS = True
```

## 🧪 Тестирование

### Unit тесты
```python
# tests/test_auth.py
class AuthTestCase(TestCase):
    def test_user_registration(self):
        response = self.client.post('/api/auth/register/', {
            'email': 'test@example.com',
            'password1': 'testpass123',
            'password2': 'testpass123',
        })
        self.assertEqual(response.status_code, 201)
```

### API тесты
```python
# tests/test_api.py
class UserAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
    
    def test_get_profile(self):
        response = self.client.get('/api/users/me/')
        self.assertEqual(response.status_code, 200)
``` 