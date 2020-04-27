from django.contrib.auth import get_user_model
from django.db import models
from django.utils.translation import gettext_lazy as _

from lushcloset.core.models.base import Base
from lushcloset.core.models.location import Location
from lushcloset.core.models.price import Price
from lushcloset.core.models.uuid import Uuid


class Listing(Base, Uuid):
    """Listing that extends `Base` and `Uuid`.

    Contains fields:
    - `title: str`
    - `description: str`
    - `creator: User`
    - `price: Price`
    - `location: Location`
    """

    title = models.CharField(max_length=100)
    description = models.TextField()
    creator = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    price = models.OneToOneField(Price, on_delete=models.CASCADE,)
    location = models.OneToOneField(Location, on_delete=models.CASCADE,)

    class Meta:
        verbose_name = _("Listing")
        verbose_name_plural = _("Listings")

    def __str__(self):
        return f"Listing: {self.uuid}"
