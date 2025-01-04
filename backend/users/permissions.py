from rest_framework import permissions


class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Разрешаем GET запросы для админов и владельцев филиалов
        if request.method in permissions.SAFE_METHODS:
            return (request.user.is_staff or
                    request.user.groups.filter(name='Branch Owner').exists() or
                    obj == request.user)
        # Изменять может только админ или сам пользователь
        return obj == request.user or request.user.is_staff


class IsBranchOwnerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return (request.user.is_staff or
                request.user.groups.filter(name='Branch Owner').exists())
