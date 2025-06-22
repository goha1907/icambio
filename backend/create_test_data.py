#!/usr/bin/env python
import os
import sys
import django

# Добавляем путь к проекту
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Настраиваем Django
django.setup()

from exchange.models import Currency, ExchangeRate
from orders.models import Review
from django.contrib.auth import get_user_model

User = get_user_model()

def create_test_data():
    print("Создание тестовых данных...")
    
    # Создаем валюты
    currencies_data = [
        {'code': 'USDT', 'name': 'Tether USD', 'symbol': '₮', 'is_active': True},
        {'code': 'USD', 'name': 'US Dollar', 'symbol': '$', 'is_active': True},
        {'code': 'ARS', 'name': 'Argentine Peso', 'symbol': '$', 'is_active': True},
        {'code': 'BTC', 'name': 'Bitcoin', 'symbol': '₿', 'is_active': True},
        {'code': 'EUR', 'name': 'Euro', 'symbol': '€', 'is_active': True},
    ]
    
    currencies = {}
    for curr_data in currencies_data:
        currency, created = Currency.objects.get_or_create(
            code=curr_data['code'],
            defaults=curr_data
        )
        currencies[curr_data['code']] = currency
        if created:
            print(f"✅ Создана валюта: {currency.code}")
        else:
            print(f"⏭️  Валюта уже существует: {currency.code}")
    
    # Создаем курсы обмена
    rates_data = [
        {
            'from_currency': 'USDT',
            'to_currency': 'ARS',
            'rate': 1050.00,
            'min_amount': 10,
            'is_active': True
        },
        {
            'from_currency': 'USDT',
            'to_currency': 'USD',
            'rate': 0.99,
            'min_amount': 50,
            'is_active': True
        },
        {
            'from_currency': 'USD',
            'to_currency': 'ARS',
            'rate': 1060.00,
            'min_amount': 20,
            'is_active': True
        },
        {
            'from_currency': 'BTC',
            'to_currency': 'USDT',
            'rate': 42000.00,
            'min_amount': 0.001,
            'is_active': True
        }
    ]
    
    for rate_data in rates_data:
        rate, created = ExchangeRate.objects.get_or_create(
            from_currency=currencies[rate_data['from_currency']],
            to_currency=currencies[rate_data['to_currency']],
            defaults={
                'rate': rate_data['rate'],
                'min_amount': rate_data['min_amount'],
                'is_active': rate_data['is_active']
            }
        )
        if created:
            print(f"✅ Создан курс: {rate.from_currency.code} → {rate.to_currency.code} = {rate.rate}")
        else:
            print(f"⏭️  Курс уже существует: {rate.from_currency.code} → {rate.to_currency.code}")
    
    # Создаем тестовые отзывы
    reviews_data = [
        {
            'display_name': 'Алексей М.',
            'text': 'Отличный сервис! Быстрый обмен, хорошие курсы. Рекомендую!',
            'rating': 5,
            'is_approved': True
        },
        {
            'display_name': 'Мария К.',
            'text': 'Пользуюсь уже полгода. Всегда быстро и надежно. Спасибо!',
            'rating': 5,
            'is_approved': True
        },
        {
            'display_name': 'Дмитрий С.',
            'text': 'Хороший курс, быстрая поддержка. Все прошло гладко.',
            'rating': 4,
            'is_approved': True
        },
        {
            'display_name': 'Анна В.',
            'text': 'Удобный интерфейс, прозрачные условия. Буду пользоваться еще.',
            'rating': 5,
            'is_approved': True
        }
    ]
    
    for review_data in reviews_data:
        review, created = Review.objects.get_or_create(
            display_name=review_data['display_name'],
            defaults=review_data
        )
        if created:
            print(f"✅ Создан отзыв от: {review.display_name}")
        else:
            print(f"⏭️  Отзыв уже существует от: {review.display_name}")
    
    print("\n🎉 Тестовые данные созданы успешно!")
    print(f"📊 Валют: {Currency.objects.count()}")
    print(f"📈 Курсов: {ExchangeRate.objects.count()}")
    print(f"💬 Отзывов: {Review.objects.filter(is_approved=True).count()}")

if __name__ == '__main__':
    create_test_data() 