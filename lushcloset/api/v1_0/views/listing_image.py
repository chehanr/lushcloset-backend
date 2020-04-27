from rest_framework import mixins, permissions, viewsets

from lushcloset.api.v1_0.serializers.listing_image import ListingImageUploadSerializer
from lushcloset.core.models.listing_image import ListingImage


class ListingImageViewSet(
    mixins.CreateModelMixin, viewsets.GenericViewSet,
):
    """`Listing Image view set."""

    queryset = ListingImage.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = ListingImageUploadSerializer
