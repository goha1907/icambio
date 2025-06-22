# Настройка Supabase для разработки

## Упрощенная настройка

Проект использует порт 3000 для фронтенда, что соответствует настройкам Supabase по умолчанию. Это избавляет от необходимости дополнительной настройки.

## Логика аутентификации

### 1. Вход
- Страница: `/login`
- Поля: email/пароль  
- Успех: переадресация на Главную страницу (`/`)

### 2. Регистрация
1. Страница: `/register`
2. Поля: email/пароль/подтверждение пароля
3. Успех: переадресация на `/confirm-email` 
4. Пользователь получает письмо с подтверждением
5. По ссылке из письма: переадресация на страницу входа
6. Вход: email/пароль → переадресация на Главную страницу

### 3. Восстановление пароля
1. На странице входа: "Забыли пароль?" → `/reset-password`
2. Ввод email → "Сбросить пароль" → `/reset-password-sent`
3. Пользователь получает письмо с инструкциями
4. По ссылке из письма: переадресация на `/set-new-password`
5. Ввод нового пароля/подтверждение → переадресация на `/login`

### 4. Смена пароля (авторизованный пользователь)
- Страница: `/change-password`
- Поля: текущий пароль/новый пароль/подтверждение нового пароля
- Успех: переадресация на страницу профиля

## Настройка Supabase

### 1. URL Configuration
В разделе "Authentication" → "URL Configuration":

**Site URL:** `http://localhost:3000`

**Redirect URLs** (добавить все эти URL):
```
http://localhost:3000/auth/confirm-email
http://localhost:3000/auth/set-new-password
http://localhost:3000/auth/callback
```

### 2. Email Templates
В разделе "Authentication" → "Email Templates":

#### Confirm signup:
**Subject:** `Confirm Your Signup`

**Message body:**
```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your user:</p>
<p><a href="{{ .SiteURL }}/auth/confirm-email?token={{ .TokenHash }}&type=signup">Confirm your mail</a></p>
```

#### Reset Password:
**Subject:** `Reset Your Password`

**Message body:**
```html
<h2>Reset Password</h2>
<p>Follow this link to reset the password for your user:</p>
<p><a href="{{ .SiteURL }}/auth/set-new-password?token={{ .TokenHash }}&type=recovery">Reset Password</a></p>
```

#### Reauthentication:
**Subject:** `Confirm Reauthentication`

**Message body:**
```html
<h2>Confirm reauthentication</h2>
<p>Enter the code: {{ .Token }}</p>
```

### 3. Проверка настроек
После внесения изменений:
1. Сохраните настройки в Supabase
2. Перезапустите фронтенд сервер
3. Попробуйте зарегистрироваться с тестовым email
4. Проверьте, что письмо приходит с правильными ссылками

### 4. Troubleshooting
- Если письма не приходят, проверьте папку "Спам"
- Убедитесь, что Site URL точно соответствует адресу вашего приложения
- Проверьте, что все Redirect URLs добавлены без лишних пробелов

## Переменные окружения

Убедитесь, что в `.env` файле правильно настроены:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Запуск

```bash
cd frontend
yarn dev
``` 