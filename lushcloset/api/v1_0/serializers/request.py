from django.core import exceptions
from rest_framework import serializers
from rest_framework.fields import CurrentUserDefault

from lushcloset import strings
from lushcloset.core import validators as core_validators
from lushcloset.core.models.listing import Listing
from lushcloset.core.models.processed_request import ProcessedRequest
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


class RequestListSerializer(RequestRetrieveSerializer):
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
    - `sender` - HiddenField
    - `note`
    - `date_est_return`
    """

    listing = serializers.UUIDField()
    sender = serializers.HiddenField(default=CurrentUserDefault())
    note = serializers.CharField(allow_blank=True, max_length=100)
    date_est_return = serializers.DateTimeField()

    def validate_listing(self, value):
        """ 
        The listing must exist. 
        
        :return: Listing Object
        """

        listing_obj = Listing.objects.filter(uuid=value).first()

        if not listing_obj:
            raise serializers.ValidationError(strings.LISTING_NOT_FOUND_DETAIL)

        return listing_obj

    def validate_date_est_return(self, value):
        """ 
        Perform model validation for `date_est_return`.
        
        :return: Datetime Object
        """

        return core_validators.validate_date_est_return(value)

    def validate(self, data):
        """ 
        Redo `Request` model create validation logic cuz DRF.
        """

        listing_obj = data["listing"]
        sender_obj = data["sender"]

        if listing_obj.creator == sender_obj:
            # The listing creator can't make a request.
            raise exceptions.PermissionDenied()

        # Check if the request has been processed.
        p_request_objs = ProcessedRequest.objects.filter(
            request__listing=listing_obj, request__sender=sender_obj,
        )

        if len(p_request_objs) > 0:
            # `ProcessedRequest` objects exists.

            # Get the last processed request.
            l_p_request_obj = p_request_objs.order_by("-date_created",)[0]

            if not l_p_request_obj.request_status == "COMPLETED":
                # The request has been processed but it's not completed.

                raise exceptions.ValidationError(strings.REQUEST_NOT_COMPLETED)

        else:
            # Not processed yet.
            if Request.objects.filter(listing=listing_obj, sender=sender_obj,).exists():
                raise exceptions.ValidationError(strings.REQUEST_ALREADY_EXISTS)

        return data

    def to_representation(self, instance):
        return RequestRetrieveSerializer(instance).data
