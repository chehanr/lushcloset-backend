from django.contrib import admin

from lushcloset.core.models.listing import Listing
from lushcloset.core.models.listing_image import ListingImage
from lushcloset.core.models.location import Location
from lushcloset.core.models.price import Price

admin.site.register(Price)
admin.site.register(Location)
admin.site.register(Listing)
admin.site.register(ListingImage)
