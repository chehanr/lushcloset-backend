from django.contrib.postgres.operations import CreateExtension
from django.db import migrations, models
from django.utils.translation import gettext_lazy as _

from lushcloset.core.models.base import Base
from lushcloset.core.models.uuid import Uuid


class Location(Base, Uuid):
    """Location that extends `Base` and `Uuid`.

    TODO:
    - Replace with gis. 

    Contains fields:
    - `google_places_id: str`
    - `latitude: float`
    - `longitude: float`
    - `note: str`
    """

    google_place_id = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=22, decimal_places=16)
    longitude = models.DecimalField(max_digits=22, decimal_places=16)
    note = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        verbose_name = _("Location")
        verbose_name_plural = _("Locations")

    def __str__(self):
        return f"Location: {self.uuid}"
