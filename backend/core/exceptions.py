from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ValidationError
from django.db import IntegrityError
import logging

logger = logging.getLogger(__name__)


class ReferralCodeGenerationError(Exception):
    """Исключение при ошибке генерации реферального кода"""
    pass


class UserCreationError(Exception):
    """Исключение при ошибке создания пользователя"""
    pass


class OrderValidationError(Exception):
    """Исключение при ошибке валидации заказа"""
    pass


class CurrencyOperationError(Exception):
    """Исключение при ошибке операций с валютой"""
    pass


def custom_exception_handler(exc, context):
    """
    Кастомный обработчик исключений для API
    """
    # Сначала используем стандартный обработчик DRF
    response = exception_handler(exc, context)
    
    if response is not None:
        # Логируем ошибку
        logger.error(
            f"API Error: {exc.__class__.__name__}: {str(exc)}",
            extra={
                'view': context['view'].__class__.__name__,
                'method': context['request'].method,
                'user': context['request'].user.email if context['request'].user.is_authenticated else 'anonymous',
            }
        )
        
        # Добавляем дополнительную информацию в ответ
        if isinstance(exc, ValidationError):
            response.data = {
                'error': 'validation_error',
                'message': 'Ошибка валидации данных',
                'details': response.data
            }
        elif isinstance(exc, IntegrityError):
            response.data = {
                'error': 'integrity_error',
                'message': 'Ошибка целостности данных',
                'details': 'Попробуйте еще раз или обратитесь к администратору'
            }
        
        return response
    
    # Обрабатываем кастомные исключения
    if isinstance(exc, ReferralCodeGenerationError):
        logger.error(f"ReferralCodeGenerationError: {str(exc)}")
        return Response({
            'error': 'referral_code_generation_error',
            'message': 'Ошибка генерации реферального кода',
            'details': str(exc)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    elif isinstance(exc, UserCreationError):
        logger.error(f"UserCreationError: {str(exc)}")
        return Response({
            'error': 'user_creation_error',
            'message': 'Ошибка создания пользователя',
            'details': str(exc)
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif isinstance(exc, OrderValidationError):
        logger.error(f"OrderValidationError: {str(exc)}")
        return Response({
            'error': 'order_validation_error',
            'message': 'Ошибка валидации заказа',
            'details': str(exc)
        }, status=status.HTTP_400_BAD_REQUEST)
    
    elif isinstance(exc, CurrencyOperationError):
        logger.error(f"CurrencyOperationError: {str(exc)}")
        return Response({
            'error': 'currency_operation_error',
            'message': 'Ошибка операции с валютой',
            'details': str(exc)
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Для необработанных исключений
    logger.error(f"Unhandled exception: {exc.__class__.__name__}: {str(exc)}")
    return Response({
        'error': 'internal_server_error',
        'message': 'Внутренняя ошибка сервера',
        'details': 'Обратитесь к администратору'
    }, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 