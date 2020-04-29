from django.db import transaction
from django.db.models.expressions import RawSQL
from django_filters import rest_framework as filters
from rest_framework import mixins, response, status, viewsets

from lushcloset.api.v1_0.permissions.listing import ListingPermission
from lushcloset.api.v1_0.serializers.listing import (
    ListingCreateSerializer,
    ListingListSerializer,
    ListingRetrieveSerializer,
)
from lushcloset.core.models.listing import Listing
from lushcloset.core.models.location import Location
from lushcloset.core.models.price import Price


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
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """`Listing` view set."""

    """
    TODO:
    - Add `PUT` methods. 
    """

    queryset = Listing.objects.all()
    permission_classes = (ListingPermission,)

    # Change lookup field from `pk` to `uuid`.
    lookup_field = "uuid"
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ListingFilter

    def get_serializer_class(self):
        if self.action == "list":
            return ListingListSerializer
        if self.action == "create":
            return ListingCreateSerializer

        return ListingRetrieveSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """ Override create method. """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        try:
            price_obj = Price.objects.create(
                value=validated_data["price"]["value"],
                currency_type=validated_data["price"]["currency_type"],
            )
        except Exception as e:
            # TODO: Log errors properly.
            print(e)

            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # validation for the location returns the geocoding result.
        geocoding_result = validated_data["location"]["address"]

        try:
            location_obj = Location.objects.create(
                google_place_id=geocoding_result["place_id"],
                latitude=geocoding_result["geometry"]["location"]["lat"],
                longitude=geocoding_result["geometry"]["location"]["lng"],
                note=validated_data["location"]["note"],
            )
        except Exception as e:
            # TODO: Log errors properly.
            print(e)

            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            listing_obj = Listing.objects.create(
                title=validated_data["title"],
                description=validated_data["description"],
                creator=request.user,
                price=price_obj,
                location=location_obj,
            )
        except Exception as e:
            # TODO: Log errors properly.
            print(e)

            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = self.get_serializer(listing_obj, context={"request": request})
        headers = self.get_success_headers(serializer.data)

        return response.Response(serializer.data, status=status.HTTP_201_CREATED)
