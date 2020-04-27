from django.conf import settings
from rest_framework import serializers

from lushcloset.core.models.listing_image import ListingImage


class ListingImageUploadSerializer(serializers.ModelSerializer):
    """Upload serializer for `ListingImage`.

    Contains fields:
    - `image`
    - `listing`
    - `date_created`
    """

    class Meta:
        model = ListingImage
        fields = (
            "image",
            "listing",
            "date_created",
        )

    def create(self, validated_data):
        # image_file = validated_data.pop("image")

        # validated_data["image"] = image_file

        return ListingImage.objects.create(**validated_data)
