from rest_framework import permissions

from lushcloset.api.common import exceptions


class UserPermission(permissions.BasePermission):
    """`User` permissions. 

    - `SAFE_METHODS` are allowed. 
    - User creation (`POST`) requires an unauthenticated request.
    - All other methods are not allowed.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "POST":
            # The request should be unauthenticated.
            if request.user.is_authenticated:
                raise exceptions.UserCreationNotAllowed

            return True

        return False
