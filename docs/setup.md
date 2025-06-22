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
    SECRET_KEY=your_django_secret_key_here # Сгенерируйте свою уникальную строку
    DEBUG=True
    ALLOWED_HOSTS=localhost,127.0.0.1

    # Настройки для Supabase (используется как основная БД и для аутентификации)
    SUPABASE_URL=https://your-supabase-project.supabase.co
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    SUPABASE_JWT_SECRET=your_supabase_jwt_secret

    # URL фронтенда (для генерации реферальных ссылок и email-ссылок)
    FRONTEND_URL=http://localhost:3000

    # Настройки для отправки email (Djoser)
    EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend # Для разработки: выводит письма в консоль
    # EMAIL_HOST=smtp.gmail.com
    # EMAIL_PORT=587
    # EMAIL_USE_TLS=True
    # EMAIL_HOST_USER=your_email@gmail.com
    # EMAIL_HOST_PASSWORD=your_email_password # Используйте App Password для Gmail
    # DEFAULT_FROM_EMAIL=your_email@gmail.com
    ```

3.  **Применение миграций и создание суперпользователя:**

    ```bash
    cd backend
    python manage.py migrate
    python manage.py createsuperuser # Следуйте инструкциям в консоли
    python manage.py create_groups # Создаст группы пользователей (Owners, Administrators, Operators)
    cd ..
    ```

4.  **Запуск Django-сервера:**

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