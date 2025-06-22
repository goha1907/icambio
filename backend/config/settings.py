# flake8: noqa
import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
import secrets  # noqa: E402 - импорт после dotenv разрешён

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_ROOT = BASE_DIR.parent  # Корень проекта (icambio/)

# Загружаем переменные окружения из корня проекта
load_dotenv(PROJECT_ROOT / '.env')

# Определяем режим отладки до получения SECRET_KEY
DEBUG = os.getenv('DEBUG', 'True') == 'True'
# По умолчанию DEBUG=True для локальной разработки. В продакшене обязательно
# задайте DEBUG=False.  # noqa: E501

# SECRET_KEY: в продакшене обязательно должен быть установлен через переменные окружения.
# В режиме разработки, если ключ не задан, создаём временный случайный ключ и выводим предупреждение.
SECRET_KEY = os.getenv('SECRET_KEY')

if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = secrets.token_urlsafe(32)
        print(
            "WARNING: SECRET_KEY is not set. Generated a temporary development "
            "key. Do NOT use this key in production."
        )
    else:
        raise ValueError("SECRET_KEY environment variable must be set in production")

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '').split(',') if os.getenv('ALLOWED_HOSTS') else []

# В продакшене ALLOWED_HOSTS должен быть явно задан
if not DEBUG and not ALLOWED_HOSTS:
    raise ValueError(
        "ALLOWED_HOSTS must be set in production environment"
    )

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third party apps
    'rest_framework',
    'corsheaders',
    'djoser',
    'django_cleanup.apps.CleanupConfig',

    # Local apps
    'users',
    'exchange',
    'orders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL')
if DATABASE_URL:
    # Используем PostgreSQL от Supabase
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
else:
    # Временно используем SQLite для разработки
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'static'

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# URL фронтенда для генерации реферальных ссылок
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5173')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings with Supabase authentication
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'users.authentication.SupabaseJWTAuthentication',
        'users.authentication.SupabaseServiceAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# Authentication backends
AUTHENTICATION_BACKENDS = [
    'users.authentication.SupabaseBackend',
    'django.contrib.auth.backends.ModelBackend',
]

# Supabase settings - READ FROM ENVIRONMENT VARIABLES
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
SUPABASE_JWT_SECRET = os.getenv('SUPABASE_JWT_SECRET')

# Validate that required Supabase environment variables are set
# Временно отключено для первоначальной настройки
if DEBUG and not SUPABASE_URL:
    print("WARNING: SUPABASE_URL not set - using placeholder")
elif not DEBUG and not SUPABASE_URL:
    raise ValueError("SUPABASE_URL environment variable is required")

if DEBUG and not SUPABASE_JWT_SECRET:
    print("WARNING: SUPABASE_JWT_SECRET not set - using placeholder")
elif not DEBUG and not SUPABASE_JWT_SECRET:
    raise ValueError("SUPABASE_JWT_SECRET environment variable is required")

# Djoser settings (keeping for potential admin use)
DJOSER = {
    'LOGIN_FIELD': 'email',
    'USER_CREATE_PASSWORD_RETYPE': True,
    'USERNAME_CHANGED_EMAIL_CONFIRMATION': False,
    'PASSWORD_CHANGED_EMAIL_CONFIRMATION': False,
    'SEND_CONFIRMATION_EMAIL': False,
    'PASSWORD_RESET_CONFIRM_URL': 'password/reset/confirm/{uid}/{token}',
    'USERNAME_RESET_CONFIRM_URL': 'username/reset/confirm/{uid}/{token}',
    'ACTIVATION_URL': 'activate/{uid}/{token}',
    'SEND_ACTIVATION_EMAIL': False,
    'SERIALIZERS': {
        'user_create': 'users.serializers.UserCreateSerializer',
        'user': 'users.serializers.UserSerializer',
        'current_user': 'users.serializers.UserSerializer',
    },
    'EMAIL': {
        'activation': 'users.email.ActivationEmail',
        'confirmation': 'users.email.ConfirmationEmail',
        'password_reset': 'users.email.PasswordResetEmail',
        'password_changed_confirmation': 'users.email.PasswordChangedConfirmationEmail',
    },
}

# CORS настройки
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Берём список разрешённых источников из переменной окружения (через запятую)
env_cors_origins = os.getenv('CORS_ALLOWED_ORIGINS')
CORS_ALLOWED_ORIGINS = (
    [origin.strip() for origin in env_cors_origins.split(',') if origin.strip()]
    if env_cors_origins else DEFAULT_CORS_ORIGINS
)

CORS_ALLOW_CREDENTIALS = True

# Разрешаем все источники **только** когда DEBUG=True и явно установлена переменная ALLOW_ALL_CORS
ALLOW_ALL_CORS = os.getenv('ALLOW_ALL_CORS', 'False') == 'True'
CORS_ALLOW_ALL_ORIGINS = DEBUG and ALLOW_ALL_CORS

# Email settings
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'  # выводит письма в консоль
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)

AUTH_USER_MODEL = 'users.User'
