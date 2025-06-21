from django.contrib.auth.models import AbstractBaseUser

from orders.models import Order, Review

# ----- Order selectors -----


def orders_for_user(user: AbstractBaseUser):
    """Return orders queryset available for the given user."""
    if user.is_anonymous:
        return Order.objects.none()

    staff_groups = ['Operators', 'Administrators', 'Owners']
    if user.groups.filter(name__in=staff_groups).exists():
        return Order.objects.all().prefetch_related('items')

    return Order.objects.filter(user=user).prefetch_related('items')


def reviews_for_user(action: str, user: AbstractBaseUser):
    """Return reviews queryset based on current action and user permissions."""
    if action == 'list_public':
        return Review.objects.filter(is_visible=True)

    if user.groups.filter(name__in=['Administrators', 'Owners']).exists():
        return Review.objects.all()

    return Review.objects.filter(order__user=user) 