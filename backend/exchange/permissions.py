from rest_framework import permissions

from exchange.models import Branch


class IsBranchManagerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Разрешаем GET запросы для всех аутентифицированных пользователей
        if request.method in permissions.SAFE_METHODS:
            return True

        # Проверяем, является ли пользователь менеджером филиала или админом
        return (
            request.user.is_staff or
            (hasattr(obj, 'branch') and obj.branch.manager == request.user) or
            (isinstance(obj, Branch) and obj.manager == request.user)
        )
