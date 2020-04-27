from enum import Enum

from django.db import models
from django.utils.translation import gettext_lazy as _


class CurrencyType(Enum):
    AUD = "Australian dollar"
    USD = "United States dollar"


class Price(models.Model):
    """Price.

    Contains fields:
    - `value: int`
    - `currency_type: Enum`
    """

    value = models.IntegerField()  # Stored as the lowest unit (cents).
    currency_type = models.CharField(
        max_length=5,
        choices=[(currency.name, currency.value) for currency in CurrencyType],
        default=CurrencyType.AUD,
    )

    class Meta:
        verbose_name = _("Price")
        verbose_name_plural = _("Prices")

    def __str__(self):
        return f"Price: {self.pk}"
