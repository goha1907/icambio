from typing import Dict, Union

from django.core.exceptions import ValidationError

from exchange.models import ExchangeRate


def calculate_exchange(
    rate: ExchangeRate,
    *,
    amount_from: Union[float, None] = None,
    amount_to: Union[float, None] = None,
) -> Dict[str, Union[str, float]]:
    """Calculate exchange amounts based on provided parameters.

    Exactly one of `amount_from` or `amount_to` must be provided.
    The helper delegates calculations to `ExchangeRate` model helpers.
    """
    if amount_from is None and amount_to is None:
        raise ValidationError("Specify `amount_from` or `amount_to`.")

    if amount_from is not None and amount_to is not None:
        raise ValidationError(
            "Specify only one of `amount_from` or `amount_to`."
        )

    try:
        if amount_from is not None:
            amount_from = float(amount_from)
            amount_to = rate.calculate_to_receive(amount_from)
        else:
            amount_to = float(amount_to)  # type: ignore[arg-type]
            amount_from = rate.calculate_to_exchange(amount_to)
    except (TypeError, ValueError) as exc:
        raise ValidationError(str(exc)) from exc

    return {
        "from_currency": rate.from_currency.code,
        "to_currency": rate.to_currency.code,
        "amount_from": amount_from,
        "amount_to": amount_to,
        "rate": rate.rate,
        "min_amount": rate.min_amount,
    } 