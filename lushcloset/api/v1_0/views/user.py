from django.contrib.auth import get_user_model
from rest_framework import mixins, viewsets

from lushcloset.api.v1_0.permissions.user import UserPermission
from lushcloset.api.v1_0.serializers.user import (
    UserCreateSerializer,
    UserRetrieveSerializer,
)


class UserViewSet(
    mixins.RetrieveModelMixin, mixins.CreateModelMixin, viewsets.GenericViewSet,
):
    """`User` view set."""

    """
    
    Notes:
    - Only makes use of active user accounts.

    TODO:
    - Automatically log in user on successful registration. 
    """

    queryset = get_user_model().objects.filter(is_active=True).all()
    permission_classes = (UserPermission,)

    # Change lookup field from `pk` to `uuid`.
    lookup_field = "uuid"

    def get_serializer_class(self):
        if self.action == "create":
            return UserCreateSerializer

        return UserRetrieveSerializer
