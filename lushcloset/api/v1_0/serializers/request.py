from rest_framework import serializers

from lushcloset.core.models.request import Request


class RequestRetrieveSerializer(serializers.ModelSerializer):
    """
    Retrieve serializer for `Request`.

    Contains fields:
    - `uuid`
    - `listing`
    - `sender`
    - `note`
    - `date_est_return`
    - `date_created`
    """

    listing = serializers.SerializerMethodField()
    sender = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = (
            "uuid",
            "listing",
            "sender",
            "note",
            "date_est_return",
            "date_created",
        )

    def get_listing(self, instance):
        """ Returns an object for a listing. """

        obj = {
            "uuid": instance.listing.uuid,
            "title": instance.listing.title,
        }

        return obj

    def get_sender(self, instance):
        """ Returns an object for a sender user object. """

        obj = {
            "uuid": instance.sender.uuid,
            "name": instance.sender.name,
        }

        return obj


class RequestListSerializer(ListingRetrieveSerializer):
    """
    List serializer for `Request`.
    
    Contains fields:
    - `uuid`
    - `listing`
    - `sender`
    - `note`
    - `date_est_return`
    - `date_created`
    """

    pass


class RequestCreateSerializer(serializers.Serializer):
    """ 
    Create serializer for `Request`.

    Contains fields:
    - `listing`
    - `note`
    - `date_est_return`
    """

    class Meta:
        model = Request
        fields = (
            "listing",
            "note",
            "date_est_return",
        )

    def to_representation(self, instance):
        return RequestRetrieveSerializer(instance).data
