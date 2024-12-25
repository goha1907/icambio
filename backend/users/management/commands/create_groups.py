from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from users.models import User


class Command(BaseCommand):
    help = 'Creates default groups and permissions'

    def handle(self, *args, **options):
        # Создаем группы
        operator_group, _ = Group.objects.get_or_create(
            name='Operator'
        )
        branch_owner_group, _ = Group.objects.get_or_create(
            name='Branch Owner'
        )
        admin_group, _ = Group.objects.get_or_create(
            name='Admin'
        )

        # Добавляем базовые разрешения
        user_ct = ContentType.objects.get_for_model(User)
        user_permissions = Permission.objects.filter(content_type=user_ct)

        # Назначаем разрешения группам
        operator_group.permissions.set([])  # Базовые права
        branch_owner_group.permissions.set(user_permissions)  # Все права на пользователей
        admin_group.permissions.set(Permission.objects.all())  # Все права

        self.stdout.write(
            self.style.SUCCESS(
                'Successfully created groups and permissions'
            )
        )
