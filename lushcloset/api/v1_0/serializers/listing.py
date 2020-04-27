import re

from rest_framework import serializers

from lushcloset.core.models.listing import Listing
from lushcloset.core.models.listing_image import ListingImage


class ListingRetrieveSerializer(serializers.ModelSerializer):
    """Retrieve serializer for `Listing`.

    Contains fields:
    - `uuid`
    - `title`
    - `description`
    - `creator`
    - `location`
    - `price`
    - `images`
    - `date_created`
    """

    creator = serializers.SerializerMethodField()
    location = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = (
            "uuid",
            "title",
            "description",
            "creator",
            "location",
            "price",
            "images",
            "date_created",
        )

    def get_creator(self, instance):
        """Returns an object for the `creator` user object.
        
        TODO: Hide surnames etc.
        """

        obj = {
            "uuid": instance.creator.uuid,
            "name": instance.creator.name,
        }

        return obj

    def get_location(self, instance):
        """Returns an object for the `location` location object.
        
        TODO: Return approximate location.
        """

        obj = {
            "approx": "",
        }

        return obj

    def get_price(self, instance):
        """Returns an object for the `price` price object."""

        obj = {
            "value": instance.price.value,
            "currency_type": instance.price.currency_type,
            "currency_type_display": instance.price.get_currency_type_display(),
        }

        return obj

    def get_images(self, instance):
        """Returns objects for the `listing_image` listing image object."""

        listing_image_objs = (
            ListingImage.objects.filter(listing=instance)
            .order_by("-date_created")
            .all()
        )

        objs = []

        for i, listing_image_obj in enumerate(listing_image_objs):
            obj = {
                "position": i,
                "url": listing_image_obj.image.url,
            }

            objs.append(obj)

        return objs


class ListingListSerializer(ListingRetrieveSerializer):
    """List serializer for `Listing`.
    
    Contains fields:
    - `uuid`
    - `title`
    - `description`
    - `creator`
    - `location`
    - `price`
    - `images`
    - `date_created`
    """

    description = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = (
            "uuid",
            "title",
            "description",
            "creator",
            "location",
            "price",
            "images",
            "date_created",
        )

    def get_description(self, instance):
        """Returns a short, safe description."""

        pattern = re.compile(r"[^\w\s]")

        return pattern.sub("", instance.description)[:100]

    def get_images(self, instance):
        """Returns an object for the `listing_image` listing image object."""

        listing_image_obj = (
            ListingImage.objects.filter(listing=instance)
            .order_by("-date_created")
            .first()
        )

        obj = []

        if listing_image_obj:
            obj = [{"position": 0, "url": listing_image_obj.image.url,}]

        return obj
