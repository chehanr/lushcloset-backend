# from django_filters import rest_framework as filters
from django.db.models import Q
from rest_framework import exceptions, mixins, response, status, viewsets

from lushcloset.api.common import exceptions as custom_exceptions
from lushcloset.api.v1_0.permissions.request import RequestPermission
from lushcloset.api.v1_0.serializers.request import (
    RequestCreateSerializer,
    RequestListSerializer,
    RequestRetrieveSerializer,
)
from lushcloset.core.models.listing import Listing
from lushcloset.core.models.request import Request


class RequestViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.CreateModelMixin,
    viewsets.GenericViewSet,
):
    """ Request API views. """

    queryset = Request.objects.all()
    permission_classes = (RequestPermission,)

    # Change lookup field from `pk` to `uuid`.
    lookup_field = "uuid"

    def get_serializer_class(self):
        if self.action == "list":
            return RequestListSerializer
        if self.action == "create":
            return RequestCreateSerializer

        return RequestRetrieveSerializer

    def create(self, request, *args, **kwargs):
        """ Override create method. """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        validated_data = serializer.validated_data

        try:
            request_obj = Request.objects.create(
                listing=validated_data["listing"],
                sender=validated_data["sender"],
                date_est_return=validated_data["date_est_return"],
                note=validated_data["note"],
            )
        except Exception as e:
            # TODO: Log errors properly.
            print(e)

            return response.Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        serializer = self.get_serializer(request_obj, context={"request": request})
        headers = self.get_success_headers(serializer.data)

        return response.Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        """ Override list method. """

        listing_uuid_p = request.query_params.get("listing_uuid")

        if not listing_uuid_p:
            raise custom_exceptions.QueryParamNotFoundNotFound(
                detail="Missing `listing_uuid` query parameter."
            )

        self.queryset = Request.objects.filter(
            listing__uuid=listing_uuid_p, listing__creator=request.user.pk
        ).order_by("-date_created")

        return super().list(request, *args, **kwargs)
