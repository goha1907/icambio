# iCambio Backend

Django бэкенд для сервиса обмена валют.

## 🚀 Быстрый старт

### Установка зависимостей

```bash
pip install -r requirements.txt
```

### Настройка окружения

1. Скопируйте `.env.example` в `.env` в корне проекта
2. Заполните необходимые переменные окружения

### Запуск

```bash
# Применение миграций
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск сервера разработки
python manage.py runserver
```

## 📚 API Документация

После запуска сервера доступна документация API:

- **Swagger UI**: http://localhost:8000/api/docs/
- **ReDoc**: http://localhost:8000/api/redoc/
- **Schema**: http://localhost:8000/api/schema/

## 🧪 Тестирование

```bash
# Запуск всех тестов
pytest

# Запуск с покрытием
pytest --cov

# Запуск в параллельном режиме
pytest -n auto
```

## 🛠️ Разработка

### Линтинг и форматирование

```bash
# Форматирование кода
black .

# Сортировка импортов
isort .

# Проверка стиля
flake8
```

### Debug Toolbar

В режиме разработки автоматически включается Django Debug Toolbar.
Доступен по адресу: http://localhost:8000/__debug__/

## 📁 Структура проекта

```
backend/
├── config/          # Настройки Django
├── core/            # Общие модели и утилиты
├── users/           # Пользователи и аутентификация
├── branches/        # Филиалы и график работы
├── exchange/        # Валюты и курсы обмена
├── orders/          # Заказы
├── reviews/         # Отзывы
└── tests/           # Тесты
```

## 🔐 Аутентификация

Проект использует 1/ для аутентификации:
- JWT токены от Supabase
- Автоматическое создание пользователей Django
- Валидация токенов на уровне Django

## 🗄️ База данных

- **Development**: SQLite (по умолчанию)
- **Production**: PostgreSQL (Supabase)

## 📦 Зависимости

### Основные:
- Django 5.0.7
- Django REST Framework 3.14
- PyJWT 2.8 (для Supabase)
- psycopg2-binary (PostgreSQL)
- drf-spectacular (API документация)

### Разработка и тестирование:
- django-debug-toolbar
- black, flake8, isort
- pytest и связанные пакеты 