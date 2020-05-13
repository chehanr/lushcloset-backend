from rest_framework import exceptions, permissions

from lushcloset.core.models.request import Request


class RequestPermission(permissions.BasePermission):
    """
    `Request` permissions. 

    - Requires an authenticated request.
    - Request retrieve (`GET`) requires the user to be the creator of the listing or the \
        sender of the request.
    - Request update (`PUT`, `PATCH`) requires the user to be the sender of the request.
    - Request delete (`DELETE`) requires the user to be the owner of the request.
    - All other methods are not allowed.
    """

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            # The request should be authenticated.
            raise exceptions.NotAuthenticated()

        return True

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            # Both the Listing creator and Request sender can perform
            # these.
            if obj.listing.creator == request.user:
                return True
            if obj.sender == request.user:
                return True

        if request.method in ("PUT", "PATCH", "DELETE"):
            # Only the request sender can perform these.
            if obj.sender == request.user:
                return True

        return False
