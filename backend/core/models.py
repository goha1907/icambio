from django.db import models


class Address(models.Model):
    """Модель адреса согласно схеме БД."""
    
    country = models.CharField('Страна', max_length=100, blank=True)
    city = models.CharField('Город', max_length=100, blank=True)
    street = models.CharField('Улица', max_length=200, blank=True)
    house_number = models.CharField('Номер дома', max_length=20, blank=True)
    postal_code = models.CharField('Почтовый индекс', max_length=20, blank=True)
    
    full_address = models.TextField(
        'Полный адрес',
        blank=False
    )
    latitude = models.DecimalField(
        'Широта',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    longitude = models.DecimalField(
        'Долгота',
        max_digits=9,
        decimal_places=6,
        null=True,
        blank=True
    )
    
    created_at = models.DateTimeField('Создан', auto_now_add=True)

    class Meta:
        verbose_name = 'Адрес'
        verbose_name_plural = 'Адреса'
        db_table = 'addresses'

    def __str__(self):
        return self.full_address

    def save(self, *args, **kwargs):
        # Автоматически формируем полный адрес, если он не задан
        if not self.full_address:
            parts = []
            if self.street and self.house_number:
                parts.append(f"{self.street}, {self.house_number}")
            elif self.street:
                parts.append(self.street)
            
            if self.city:
                parts.append(self.city)
            
            if self.country:
                parts.append(self.country)
            
            if self.postal_code:
                parts.append(self.postal_code)
            
            self.full_address = (
                ', '.join(parts) if parts else 'Адрес не указан'
            )
        
        super().save(*args, **kwargs)
