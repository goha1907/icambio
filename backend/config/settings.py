# flake8: noqa
import os
import logging
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
        logging.warning(
            "SECRET_KEY is not set. Generated a temporary development "
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
    'django_extensions',
    'drf_spectacular',
    
    # Django Allauth
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.apple',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    'allauth.socialaccount.providers.vk',
    'allauth.socialaccount.providers.yandex',

    # Local apps
    'core',
    'users',
    'branches',
    'exchange',
    'orders',
    'reviews',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',  # Django Allauth middleware
    'users.middleware.AutoUserCreationMiddleware',  # Автоматическое создание пользователей
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
TEST_DATABASE_URL = os.getenv('TEST_DATABASE_URL')

if DATABASE_URL:
    # Используем PostgreSQL или другую БД, если указано в DATABASE_URL
    DATABASES = {
        'default': dj_database_url.parse(DATABASE_URL)
    }
    # Опционально: отдельная тестовая БД
    if TEST_DATABASE_URL:
        DATABASES['default']['TEST'] = {
            'NAME': dj_database_url.parse(TEST_DATABASE_URL)['NAME']
        }
else:
    # По умолчанию используем SQLite для разработки
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
LANGUAGES = [
    ('ru', 'Russian'),
    ('en', 'English'),
]
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
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Logging configuration for development
if DEBUG:
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'root': {
            'handlers': ['console'],
            'level': 'DEBUG',
        },
    }

# REST Framework settings with Django Allauth + DRF Simple JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,  # По умолчанию 10 элементов на страницу
    'EXCEPTION_HANDLER': 'core.exceptions.custom_exception_handler',
}

# Django Allauth settings
SITE_ID = 1

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# Django Allauth configuration
ACCOUNT_LOGIN_METHODS = {'email'}
ACCOUNT_SIGNUP_FIELDS = ['email*', 'password1*', 'password2*']
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_USER_MODEL_USERNAME_FIELD = None

# Email confirmation settings
ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 3
ACCOUNT_RATE_LIMITS = {
    'login_failed': '5/5m',  # 5 попыток за 5 минут
    'signup': '10/h',        # 10 регистраций в час
    'password_reset': '5/h', # 5 сбросов пароля в час
}

# Social account settings
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_EMAIL_REQUIRED = True
SOCIALACCOUNT_EMAIL_VERIFICATION = 'mandatory'

# DRF Simple JWT settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME', 5))),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME', 1))),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': os.getenv('JWT_SECRET_KEY', SECRET_KEY),
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    
    'JTI_CLAIM': 'jti',
}

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

# DRF SPECTACULAR (API ДОКУМЕНТАЦИЯ)
SPECTACULAR_SETTINGS = {
    'TITLE': 'iCambio API',
    'DESCRIPTION': 'API для сервиса обмена валют',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SCHEMA_PATH_PREFIX': '/api/v1/',
}

# DJANGO DEBUG TOOLBAR (ТОЛЬКО В DEVELOPMENT)
if DEBUG:
    INSTALLED_APPS.append('debug_toolbar')
    MIDDLEWARE.insert(0, 'debug_toolbar.middleware.DebugToolbarMiddleware')
    
    INTERNAL_IPS = [
        '127.0.0.1',
        'localhost',
    ]

# CORS настройки
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5173",  # Оставляем для обратной совместимости
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
# IMPORTANT: Всегда устанавливайте ALLOW_ALL_CORS=False в .env для production/staging
ALLOW_ALL_CORS = os.getenv('ALLOW_ALL_CORS', 'False') == 'True'
CORS_ALLOW_ALL_ORIGINS = DEBUG and ALLOW_ALL_CORS

if DEBUG and ALLOW_ALL_CORS:
    logging.warning("CORS_ALLOW_ALL_ORIGINS is enabled. Do NOT use in production!")
elif not DEBUG and ALLOW_ALL_CORS:
    raise ValueError("ALLOW_ALL_CORS cannot be True in production environment")

# ==============================================
# 🔒 PRODUCTION SECURITY SETTINGS
# ==============================================

# Security settings for production
if not DEBUG:
    # HTTPS settings
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    
    # Cookie settings
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    CSRF_COOKIE_HTTPONLY = True
    
    # Additional security headers
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    X_FRAME_OPTIONS = 'DENY'
    
    # Content Security Policy (CSP)
    SECURE_CSP_HEADER = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", "data:", "https:"],
        'connect-src': ["'self'"],
        'font-src': ["'self'"],
        'object-src': ["'none'"],
        'media-src': ["'self'"],
        'frame-src': ["'none'"],
    }
    
    # Rate limiting settings
    RATELIMIT_ENABLE = True
    RATELIMIT_USE_CACHE = 'default'
    
    # Logging configuration for production
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'verbose': {
                'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
                'style': '{',
            },
            'simple': {
                'format': '{levelname} {message}',
                'style': '{',
            },
        },
        'handlers': {
            'file': {
                'level': 'INFO',
                'class': 'logging.FileHandler',
                'filename': BASE_DIR / 'logs' / 'django.log',
                'formatter': 'verbose',
            },
            'console': {
                'level': 'INFO',
                'class': 'logging.StreamHandler',
                'formatter': 'simple',
            },
        },
        'root': {
            'handlers': ['console', 'file'],
            'level': 'INFO',
        },
        'loggers': {
            'django': {
                'handlers': ['console', 'file'],
                'level': 'INFO',
                'propagate': False,
            },
            'django.security': {
                'handlers': ['console', 'file'],
                'level': 'WARNING',
                'propagate': False,
            },
        },
    }
