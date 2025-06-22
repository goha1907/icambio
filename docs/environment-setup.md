# 🔧 Настройка Переменных Окружения

## Создание файла .env

Создайте файл `.env` в корне проекта (рядом с папками `frontend/` и `backend/`) и заполните его следующими переменными:

```bash
# ==============================================
# 🐍 DJANGO BACKEND
# ==============================================

# Django Security
SECRET_KEY=your-super-secret-django-key-here-change-this-in-production
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database (PostgreSQL от Supabase)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

# Альтернативно, можно задать отдельно:
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=your-db-password
# DB_HOST=db.your-project-ref.supabase.co
# DB_PORT=5432

# Frontend URL (для генерации реферальных ссылок)
FRONTEND_URL=http://localhost:5173

# Email settings (опционально)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# ==============================================
# 🔐 SUPABASE НАСТРОЙКИ
# ==============================================

# Supabase Project URL
SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Keys
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# JWT Secret (для валидации токенов)
SUPABASE_JWT_SECRET=your-jwt-secret-from-supabase

# ==============================================
# ⚛️ FRONTEND (VITE) - Префикс VITE_ обязателен!
# ==============================================

# Supabase для фронтенда (дублируем с префиксом VITE_)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 📋 Инструкция по получению данных Supabase

1. **Создайте проект в Supabase:**
   - Перейдите на https://supabase.com
   - Создайте новый проект
   - Дождитесь завершения настройки

2. **Получите ключи API:**
   - В панели Supabase перейдите в `Settings > API`
   - Скопируйте:
     - `Project URL` → `SUPABASE_URL` и `VITE_SUPABASE_URL`
     - `anon public` → `SUPABASE_ANON_KEY` и `VITE_SUPABASE_ANON_KEY`
     - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

3. **Получите JWT Secret:**
   - В той же секции `Settings > API`
   - Найдите `JWT Settings`
   - Скопируйте `JWT Secret` → `SUPABASE_JWT_SECRET`

4. **Получите строку подключения к БД:**
   - Перейдите в `Settings > Database`
   - Найдите `Connection string`
   - Выберите `URI` и скопируйте → `DATABASE_URL`

## ⚠️ Важные замечания

- **Никогда не коммитьте файл `.env` в Git!** Он уже добавлен в `.gitignore`
- **Service Role Key** имеет полные права администратора - храните его в секрете
- **JWT Secret** используется для валидации токенов - без него аутентификация не будет работать
- Для production используйте отдельный проект Supabase с другими ключами

## 🔍 Проверка настройки

После создания `.env` файла:

1. **Проверьте Django:**
   ```bash
   cd backend
   python manage.py check
   ```

2. **Проверьте подключение к БД:**
   ```bash
   python manage.py migrate --dry-run
   ```

3. **Проверьте фронтенд:**
   ```bash
   cd frontend
   yarn dev
   ```

Если все настроено правильно, приложения должны запуститься без ошибок. 