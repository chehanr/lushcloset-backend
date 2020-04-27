from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from lushcloset.api.v1_0.serializers.me import MeRetrieveSerializer, MeUpdateSerializer


class MeView(generics.RetrieveUpdateAPIView):
    """Authenticated user view."""

    """
    TODO: Add delete.
    """

    permission_classes = (IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH",):
            return MeUpdateSerializer

        return MeRetrieveSerializer

    def get_object(self):
        return self.request.user
