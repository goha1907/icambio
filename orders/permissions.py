from rest_framework import permissions


class IsOrderOwner(permissions.BasePermission):
    """
    Разрешение, позволяющее только владельцу заказа редактировать его.
    """
    def has_object_permission(self, request, view, obj):
        # Проверяем, является ли пользователь владельцем заказа
        return obj.user == request.user


class CanManageOrders(permissions.BasePermission):
    """
    Разрешение для сотрудников, позволяющее управлять заказами.
    """
    def has_permission(self, request, view):
        # Проверяем, входит ли пользователь в группы, которые могут управлять заказами
        return request.user.groups.filter(
            name__in=['Operator', 'Branch Owner', 'Admin']
        ).exists()
