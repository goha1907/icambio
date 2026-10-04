import csv
from django.core.management.base import BaseCommand
from core.models import Address
from exchange.models import Currency, ExchangeRate
from branches.models import Branch, BranchHours
from django.db import transaction


class Command(BaseCommand):
    help = 'Загрузка справочных данных (Address, Currency, Branch, BranchHours, ExchangeRate) из CSV файлов в папке data/'

    def handle(self, *args, **options):
        with transaction.atomic():
            addresses_count = self.load_addresses()
            currencies_count = self.load_currencies()
            branches_count = self.load_branches()
            hours_count = self.load_branch_hours()
            rates_count = self.load_exchange_rates()
        self.stdout.write(self.style.SUCCESS(
            f'Загружено: {addresses_count} адресов, {currencies_count} валют, {branches_count} филиалов, {hours_count} графиков, {rates_count} курсов.'
        ))

    def load_addresses(self):
        Address.objects.all().delete()
        with open('data/addresses.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            addresses = [
                Address(
                    country=row['country'],
                    city=row['city'],
                    street=row['street'],
                    house_number=row['house_number'],
                    postal_code=row['postal_code'],
                    latitude=row['latitude'] or None,
                    longitude=row['longitude'] or None
                ) for row in reader
            ]
            Address.objects.bulk_create(addresses)
        return len(addresses)

    def load_currencies(self):
        Currency.objects.all().delete()
        with open('data/currencies.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            currencies = [
                Currency(
                    code=row['code'],
                    name=row['name'],
                    symbol=row['symbol'],
                    decimal_places=row['decimal_places']
                ) for row in reader
            ]
            Currency.objects.bulk_create(currencies)
        return len(currencies)

    def load_branches(self):
        Branch.objects.all().delete()
        with open('data/branches.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            branches = []
            for row in reader:
                try:
                    address_id = int(row['address_id']) if row['address_id'] else None
                    if address_id and not Address.objects.filter(id=address_id).exists():
                        self.stdout.write(self.style.WARNING(
                            f'Пропускаем Branch с несуществующим address_id={address_id}'
                        ))
                        address_id = None
                    
                    branches.append(Branch(
                        name=row['name'],
                        email=row['email'],
                        address_id=address_id,
                        is_active=row['is_active'].lower() == 'true'
                    ))
                except ValueError:
                    self.stdout.write(self.style.WARNING(
                        f'Пропускаем Branch с некорректным address_id={row["address_id"]}'
                    ))
                    branches.append(Branch(
                        name=row['name'],
                        email=row['email'],
                        address_id=None,
                        is_active=row['is_active'].lower() == 'true'
                    ))
            
            Branch.objects.bulk_create(branches)
        return len(branches)

    def load_branch_hours(self):
        BranchHours.objects.all().delete()
        with open('data/branch_hours.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            hours = []
            for row in reader:
                # Проверяем, существует ли филиал
                try:
                    branch_id = int(row['branch_id']) if row['branch_id'] else None
                    if branch_id and not Branch.objects.filter(id=branch_id).exists():
                        self.stdout.write(self.style.WARNING(
                            f'Пропускаем BranchHours для несуществующего branch_id={branch_id}'
                        ))
                        continue
                    
                    hours.append(BranchHours(
                        branch_id=branch_id,
                        weekday=row['weekday'],
                        open_time=row['open_time'],
                        close_time=row['close_time'],
                        is_open=row['is_open'].lower() == 'true'
                    ))
                except ValueError:
                    self.stdout.write(self.style.WARNING(
                        f'Пропускаем BranchHours с некорректным branch_id={row["branch_id"]}'
                    ))
                    continue
            
            BranchHours.objects.bulk_create(hours)
        return len(hours)

    def load_exchange_rates(self):
        ExchangeRate.objects.all().delete()
        with open('data/exchange_rates.csv', 'r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            rates = []
            for row in reader:
                # Проверяем, существуют ли связанные объекты
                try:
                    currency_from_id = int(row['currency_from_id'])
                    currency_to_id = int(row['currency_to_id'])
                    branch_id = int(row['branch_id'])
                    
                    if not Currency.objects.filter(id=currency_from_id).exists():
                        self.stdout.write(self.style.WARNING(
                            f'Пропускаем ExchangeRate для несуществующей валюты from_id={currency_from_id}'
                        ))
                        continue
                    
                    if not Currency.objects.filter(id=currency_to_id).exists():
                        self.stdout.write(self.style.WARNING(
                            f'Пропускаем ExchangeRate для несуществующей валюты to_id={currency_to_id}'
                        ))
                        continue
                    
                    if not Branch.objects.filter(id=branch_id).exists():
                        self.stdout.write(self.style.WARNING(
                            f'Пропускаем ExchangeRate для несуществующего branch_id={branch_id}'
                        ))
                        continue
                    
                    rates.append(ExchangeRate(
                        currency_from_id=currency_from_id,
                        currency_to_id=currency_to_id,
                        branch_id=branch_id,
                        min_amount=row['min_amount'],
                        max_amount=row['max_amount'] or None,
                        rate=row['rate'],
                        is_hot=row['is_hot'].lower() == 'true',
                        visible=row['visible'].lower() == 'true',
                        in_filter=row['in_filter'].lower() == 'true'
                    ))
                except ValueError as e:
                    self.stdout.write(self.style.WARNING(
                        f'Пропускаем ExchangeRate с некорректными данными: {e}'
                    ))
                    continue
            
            ExchangeRate.objects.bulk_create(rates)
        return len(rates) 