from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets

from lushcloset.api.v1_0.serializers.user import UserRetrieveSerializer


class UserViewSet(
    mixins.RetrieveModelMixin, viewsets.GenericViewSet,
):
    """`User view set."""

    """
    
    Notes:
    - Only makes use of active user accounts.
    """

    queryset = get_user_model().objects.filter(is_active=True)

    # Change lookup field from `pk` to `uuid`.
    lookup_field = "uuid"

    def get_serializer_class(self):
        return UserRetrieveSerializer
