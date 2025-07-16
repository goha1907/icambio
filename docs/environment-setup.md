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

# Database
# Разработка (SQLite)
DATABASE_URL=sqlite:///db.sqlite3

# Продакшн (PostgreSQL) - раскомментируйте для продакшна
# DATABASE_URL=postgresql://username:password@localhost:5432/icambio_db

# Frontend URL (для генерации реферальных ссылок)
FRONTEND_URL=http://localhost:3000

# Email settings (для Django Allauth)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=your-email@gmail.com

# ==============================================
# ⚛️ FRONTEND (VITE) - Префикс VITE_ обязателен!
# ==============================================

# API URL для фронтенда
VITE_API_URL=http://localhost:8000/api/v1
```

## 📋 Инструкция по настройке

1. **Создайте файл `.env` в корне проекта**
2. **Скопируйте переменные выше и заполните реальными значениями**
3. **Для email настроек:**
   - Используйте Gmail с включенной двухфакторной аутентификацией
   - Создайте пароль приложения в настройках безопасности Gmail
   - Используйте этот пароль в `EMAIL_HOST_PASSWORD`

## 🗄️ Настройка базы данных

### Разработка (SQLite)
Для разработки используется SQLite, который не требует дополнительной настройки:
```bash
DATABASE_URL=sqlite:///db.sqlite3
```

### Продакшн (PostgreSQL)
Для продакшна используется PostgreSQL:

1. **Установите PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Создайте базу данных:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE icambio_db;
   CREATE USER icambio_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE icambio_db TO icambio_user;
   \q
   ```

3. **Настройте переменную окружения:**
   ```bash
   DATABASE_URL=postgresql://icambio_user:your_password@localhost:5432/icambio_db
   ```

4. **Установите зависимости для PostgreSQL:**
   ```bash
   cd backend
   pip install psycopg2-binary
   ```

## ⚠️ Важные замечания

- **Никогда не коммитьте файл `.env` в Git!** Он уже добавлен в `.gitignore`
- **SECRET_KEY** должен быть уникальным и секретным для каждого окружения
- **Email настройки** необходимы для работы Django Allauth (регистрация, сброс пароля)
- Для production используйте отдельные настройки с другими ключами
- **PostgreSQL** рекомендуется для продакшна из-за лучшей производительности и надежности

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

## 🚀 Запуск проекта

### Backend (порт 8000):
```bash
cd backend
python manage.py runserver
```

### Frontend (порт 3000):
```bash
cd frontend
yarn dev
```

### Доступ к приложениям:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000/api/v1
- **Django Admin:** http://localhost:8000/admin
- **API Docs:** http://localhost:8000/api/docs 