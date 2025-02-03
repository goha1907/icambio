from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from users.models import User
from exchange.models import Currency, ExchangeRate, ExchangeOffice, CurrencyBalance
from orders.models import Order, OrderItem, Review


class Command(BaseCommand):
    help = 'Create default groups and permissions'

    def handle(self, *args, **options):
        # Создаем группы
        operator_group, _ = Group.objects.get_or_create(name='Operators')
        admin_group, _ = Group.objects.get_or_create(name='Administrators')
        owner_group, _ = Group.objects.get_or_create(name='Owners')

        # Получаем ContentType для наших моделей
        order_ct = ContentType.objects.get_for_model(Order)
        currency_ct = ContentType.objects.get_for_model(Currency)
        rate_ct = ContentType.objects.get_for_model(ExchangeRate)
        office_ct = ContentType.objects.get_for_model(ExchangeOffice)
        balance_ct = ContentType.objects.get_for_model(CurrencyBalance)
        review_ct = ContentType.objects.get_for_model(Review)

        # Права для операторов
        operator_permissions = [
            Permission.objects.get(codename='view_order', content_type=order_ct),
            Permission.objects.get(codename='change_order', content_type=order_ct),
            Permission.objects.get(codename='view_currency', content_type=currency_ct),
            Permission.objects.get(codename='view_exchangerate', content_type=rate_ct),
            Permission.objects.get(codename='view_review', content_type=review_ct),
        ]
        operator_group.permissions.set(operator_permissions)

        # Права для администраторов
        admin_permissions = [
            # Заказы
            Permission.objects.get(codename='add_order', content_type=order_ct),
            Permission.objects.get(codename='change_order', content_type=order_ct),
            Permission.objects.get(codename='view_order', content_type=order_ct),
            Permission.objects.get(codename='delete_order', content_type=order_ct),
            # Валюты и курсы
            Permission.objects.get(codename='add_currency', content_type=currency_ct),
            Permission.objects.get(codename='change_currency', content_type=currency_ct),
            Permission.objects.get(codename='view_currency', content_type=currency_ct),
            Permission.objects.get(codename='add_exchangerate', content_type=rate_ct),
            Permission.objects.get(codename='change_exchangerate', content_type=rate_ct),
            Permission.objects.get(codename='view_exchangerate', content_type=rate_ct),
            # Отзывы
            Permission.objects.get(codename='change_review', content_type=review_ct),
            Permission.objects.get(codename='view_review', content_type=review_ct),
            Permission.objects.get(codename='delete_review', content_type=review_ct),
        ]
        admin_group.permissions.set(admin_permissions)

        # Владелец получает все права
        owner_permissions = Permission.objects.filter(
            content_type__in=[
                order_ct, currency_ct, rate_ct,
                office_ct, balance_ct, review_ct
            ]
        )
        owner_group.permissions.set(owner_permissions)

        self.stdout.write(self.style.SUCCESS('Successfully created groups and permissions'))
