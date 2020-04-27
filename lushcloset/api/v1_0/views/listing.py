from django.db.models.expressions import RawSQL
from django_filters import rest_framework as filters
from rest_framework import mixins, viewsets

from lushcloset.api.v1_0.serializers.listing import (
    ListingListSerializer,
    ListingRetrieveSerializer,
)
from lushcloset.core.models.listing import Listing
from lushcloset.core.models.location import Location


def get_locations_nearby_coords(latitude, longitude, max_distance=None):
    """
    Return objects sorted by distance to specified coordinates
    which distance is less than max_distance given in kilometers

    This was stolen from SO.
    It's ugly and hella inefficient.
    
    TODO: Change later. 
    """

    # Great circle distance formula
    gcd_formula = "6371 * acos(least(greatest(\
    cos(radians(%s)) * cos(radians(latitude)) \
    * cos(radians(longitude) - radians(%s)) + \
    sin(radians(%s)) * sin(radians(latitude)) \
    , -1), 1))"

    distance_raw_sql = RawSQL(gcd_formula, (latitude, longitude, latitude))

    locations = (
        Location.objects.all().annotate(distance=distance_raw_sql).order_by("distance")
    )

    if max_distance is not None:
        locations = locations.filter(distance__lt=max_distance)

    queryset = Listing.objects.filter(
        location__id__in=[locations.values_list("id", flat=True)]
    )

    return queryset


class ListingFilter(filters.FilterSet):
    title = filters.CharFilter(field_name="title", lookup_expr="icontains")
    price__gt = filters.NumberFilter(field_name="price__value", lookup_expr="gt")
    price__lt = filters.NumberFilter(field_name="price__value", lookup_expr="lt")
    location = filters.CharFilter(
        label="location (lat|lng|max-dist)", method="location_filter"
    )

    class Meta:
        model = Listing
        fields = {}

    def location_filter(self, queryset, value, *args, **kwargs):
        try:
            if args:
                lat, lng, mdist = args[0].split("|")

                queryset = get_locations_nearby_coords(lat, lng, mdist)
        except ValueError:
            pass

        return queryset


class ListingViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
):
    """`Listing view set."""

    """
    
    Notes:
    - Only makes use of active user accounts.
    """

    queryset = Listing.objects.all()

    # Change lookup field from `pk` to `uuid`.
    lookup_field = "uuid"
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ListingFilter

    def get_serializer_class(self):
        if self.action == "list":
            return ListingListSerializer

        return ListingRetrieveSerializer
