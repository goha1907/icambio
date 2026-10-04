from rest_framework import permissions


class BaseRolePermission(permissions.BasePermission):
    """Базовый класс для проверки ролей пользователя"""
    
    def __init__(self, allowed_roles=None):
        self.allowed_roles = allowed_roles or []
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        return request.user.role in self.allowed_roles


class IsOperator(BaseRolePermission):
    """Права оператора и выше (operator, admin, owner)"""
    
    def __init__(self):
        super().__init__(['operator', 'admin', 'owner'])


class IsAdmin(BaseRolePermission):
    """Права администратора и выше (admin, owner)"""
    
    def __init__(self):
        super().__init__(['admin', 'owner'])


class IsOwner(BaseRolePermission):
    """Права только владельца (owner)"""
    
    def __init__(self):
        super().__init__(['owner'])


class IsOwnerOrOperator(permissions.BasePermission):
    """Права владельца объекта или оператора+"""
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False
        
        # Операторы и выше могут видеть все объекты
        if request.user.role in ['operator', 'admin', 'owner']:
            return True
        
        # Обычные пользователи могут видеть только свои объекты
        return True
    
    def has_object_permission(self, request, view, obj):
        # Операторы и выше могут видеть все объекты
        if request.user.role in ['operator', 'admin', 'owner']:
            return True
        
        # Обычные пользователи могут видеть только свои объекты
        return obj.user == request.user
