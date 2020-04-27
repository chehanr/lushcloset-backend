from django.db import models
from django.utils.translation import gettext_lazy as _

from lushcloset.core.models.base import Base
from lushcloset.core.models.listing import Listing
from lushcloset.core.models.uuid import Uuid


class ListingImage(Base, Uuid):
    """Listing Image that extends `Base` and `Uuid`.

    Contains fields:
    - `image: FileField`
    - `listing: Listing`
    """

    image = models.FileField()
    listing = models.ForeignKey(Listing, on_delete=models.CASCADE,)

    class Meta:
        verbose_name = _("Listing Image")
        verbose_name_plural = _("Listing Images")

    def __str__(self):
        return f"Listing Image: {self.uuid}"
