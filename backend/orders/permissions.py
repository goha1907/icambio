from rest_framework import permissions


class IsOrderOwner(permissions.BasePermission):
    """
    Разрешение, позволяющее только владельцу заказа редактировать его.
    """
    def has_object_permission(self, request, view, obj):
        # Проверяем, является ли пользователь владельцем заказа
        return obj.user == request.user


class CanCreateReview(permissions.BasePermission):
    """
    Разрешение на создание отзыва к заказу
    """
    def has_object_permission(self, request, view, obj):
        # Проверяем, что заказ выполнен и пользователь является его владельцем
        return (obj.order.status == 'COMPLETED' and
                obj.order.user == request.user)


class CanManageOrders(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.is_staff:
            return True
        if view.action in ['create', 'list', 'retrieve']:
            return True
        if view.action == 'change_status':
            return request.user.groups.filter(
                name__in=['Operator', 'Branch Owner', 'Admin']
            ).exists()
        return False

    def has_object_permission(self, request, view, obj):
        # Владелец филиала может управлять только заказами своего филиала
        if request.user.groups.filter(name='Branch Owner').exists():
            return obj.branch.manager == request.user
        return True
