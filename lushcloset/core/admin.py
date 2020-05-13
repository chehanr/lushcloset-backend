from django.contrib import admin

from lushcloset.core.models.listing import Listing
from lushcloset.core.models.listing_image import ListingImage
from lushcloset.core.models.location import Location
from lushcloset.core.models.price import Price
from lushcloset.core.models.processed_request import ProcessedRequest
from lushcloset.core.models.request import Request

admin.site.register(Price)
admin.site.register(Location)
admin.site.register(Listing)
admin.site.register(ListingImage)
admin.site.register(Request)
admin.site.register(ProcessedRequest)
