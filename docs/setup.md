# 🛠️ Настройка и запуск проекта

Этот документ содержит пошаговые инструкции по настройке и запуску локальной версии проекта `icambio`.

---

## 1. Общие требования

-   **Python 3.10+**
-   **Node.js 18+**
-   **npm** или **Yarn** (предпочтительно Yarn)
-   **Git**

---

## 2. Клонирование репозитория

```bash
git clone https://github.com/goha1907/icambio.git
cd icambio
```

---

## 3. Настройка Бэкенда (Django)

1.  **Создание виртуального окружения и установка зависимостей:**

    ```bash
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

2.  **Настройка переменных окружения:**

    В корневой директории проекта `icambio` создайте файл `.env`:

    ```dotenv
    # Django Backend Settings
    SECRET_KEY=your-secret-key-here
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1

    # Frontend URL
    FRONTEND_URL=http://localhost:3000

    # Email settings (для Django Allauth)
    EMAIL_HOST_USER=your-email@gmail.com
    EMAIL_HOST_PASSWORD=your-app-password
    DEFAULT_FROM_EMAIL=your-email@gmail.com

    # Database
    # Разработка (SQLite)
    DATABASE_URL=sqlite:///db.sqlite3
    
    # Продакшн (PostgreSQL) - раскомментируйте для продакшна
    # DATABASE_URL=postgresql://username:password@localhost:5432/icambio_db
    ```

3.  **Настройка базы данных:**

    ### Разработка (SQLite)
    SQLite используется по умолчанию и не требует дополнительной настройки.

    ### Продакшн (PostgreSQL)
    Для продакшна рекомендуется использовать PostgreSQL:

    ```bash
    # Установка PostgreSQL (Ubuntu/Debian)
    sudo apt-get install postgresql postgresql-contrib
    
    # Создание базы данных
    sudo -u postgres psql
    CREATE DATABASE icambio_db;
    CREATE USER icambio_user WITH PASSWORD 'your_password';
    GRANT ALL PRIVILEGES ON DATABASE icambio_db TO icambio_user;
    \q
    
    # Установка Python драйвера для PostgreSQL
    pip install psycopg2-binary
    ```

4.  **Применение миграций и создание суперпользователя:**

    ```bash
    cd backend
    python manage.py migrate
    python manage.py createsuperuser # Следуйте инструкциям в консоли
    python manage.py create_groups # Создаст группы пользователей (Owners, Administrators, Operators)
    cd ..
    ```

5.  **Запуск Django-сервера:**

    ```bash
    cd backend
    python manage.py runserver
    # Сервер будет доступен по адресу: http://127.0.0.1:8000/
    cd ..
    ```

---

## 4. Настройка Фронтенда (React)

1.  **Установка зависимостей:**

    ```bash
    cd frontend
    yarn install
    cd ..
    ```

2.  **Запуск фронтенд-приложения:**

    ```bash
    cd frontend
    yarn dev
    # Приложение будет доступно по адресу: http://localhost:3000/
    cd ..
    ```

    **Важно:** Если при запуске получаете ошибку "Port is already in use", освободите порт:
    ```bash
    # Завершить процесс на порту 3000
    lsof -ti:3000 | xargs kill -9
    # Затем запустить снова
    yarn dev
    ```

---

## 5. Доступ к Django Admin

После запуска бэкенда и создания суперпользователя вы можете получить доступ к админ-панели Django по адресу:

`http://127.0.0.1:8000/admin/`

Используйте email и пароль суперпользователя, созданные ранее.

---

## 6. Аутентификация

Проект использует **Django Allauth** для аутентификации пользователей:

- **Регистрация:** `/accounts/signup/`
- **Вход:** `/accounts/login/`
- **Выход:** `/accounts/logout/`
- **Сброс пароля:** `/accounts/password/reset/`

Все эндпоинты аутентификации доступны через Django REST Framework API. 