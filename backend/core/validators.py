from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re


def validate_phone_number(value):
    """Валидация номера телефона"""
    if not value:
        return
    
    # Убираем все нецифровые символы
    digits_only = re.sub(r'\D', '', str(value))
    
    # Проверяем длину (должно быть 10-15 цифр)
    if len(digits_only) < 10 or len(digits_only) > 15:
        raise ValidationError(
            _('Номер телефона должен содержать от 10 до 15 цифр')
        )


def validate_telegram_username(value):
    """Валидация username Telegram"""
    if not value:
        return
    
    # Telegram username должен начинаться с @ и содержать 5-32 символа
    if not re.match(r'^@[a-zA-Z0-9_]{5,32}$', value):
        raise ValidationError(
            _('Telegram username должен начинаться с @ и содержать 5-32 символа (буквы, цифры, подчеркивания)')
        )


def validate_referral_code(value):
    """Валидация реферального кода"""
    if not value:
        return
    
    # Реферальный код должен содержать только заглавные буквы и цифры, длиной ровно 8 символов
    if not re.match(r'^[A-Z0-9]{8}$', value):
        raise ValidationError(
            _('Реферальный код должен содержать только заглавные буквы и цифры, длиной ровно 8 символов')
        )


def validate_currency_amount(value):
    """Валидация суммы валюты"""
    if value <= 0:
        raise ValidationError(
            _('Сумма должна быть больше нуля')
        )
    
    if value > 999999999.9999:  # Максимум 15 цифр, 4 после запятой
        raise ValidationError(
            _('Сумма слишком большая')
        )


def validate_exchange_rate(value):
    """Валидация курса обмена"""
    if value <= 0:
        raise ValidationError(
            _('Курс обмена должен быть больше нуля')
        )
    
    if value > 999999.99999999:  # Максимум 15 цифр, 8 после запятой
        raise ValidationError(
            _('Курс обмена слишком большой')
        )


def validate_postal_code(value):
    """Валидация почтового индекса (международный формат)"""
    if not value:
        return
    
    # Убираем пробелы и дефисы
    clean_value = re.sub(r'[\s\-]', '', str(value))
    
    # Почтовый индекс должен содержать только цифры, длиной 3-10 символов
    # Поддерживает форматы: 1234 (Аргентина), 12345 (США), 123456 (Россия), 12345678 (Китай)
    if not re.match(r'^\d{3,10}$', clean_value):
        raise ValidationError(
            _('Почтовый индекс должен содержать только цифры, длиной 3-10 символов')
        )


def validate_house_number(value):
    """Валидация номера дома"""
    if not value:
        return
    
    # Номер дома может содержать цифры, буквы, дефисы, слеши
    if not re.match(r'^[0-9а-яА-Яa-zA-Z\-/\\]+$', value):
        raise ValidationError(
            _('Номер дома может содержать только цифры, буквы, дефисы и слеши')
        )


def validate_rating(value):
    """Валидация рейтинга (1-5)"""
    if not isinstance(value, int) or value < 1 or value > 5:
        raise ValidationError(
            _('Рейтинг должен быть целым числом от 1 до 5')
        )


def validate_comment_length(value):
    """Валидация длины комментария"""
    if len(value) > 1000:
        raise ValidationError(
            _('Комментарий не должен превышать 1000 символов')
        )


def validate_email_domain(value):
    """Валидация домена email"""
    if not value:
        return
    
    # Проверяем, что это действительно email
    if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
        raise ValidationError(
            _('Введите корректный email адрес')
        )
