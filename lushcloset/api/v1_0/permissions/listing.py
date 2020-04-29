from rest_framework import exceptions, permissions


class ListingPermission(permissions.BasePermission):
    """
    `Listing` permissions. 

    - `SAFE_METHODS` are allowed. 
    - Listing creation (`POST`) requires an authenticated request.
    - Listing update (`POST`, `POST`) requires the user to be the owner of the listing.
    - All other methods are not allowed.

    TODO:
    - Implement object level permission checks.  
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if request.method == "POST":
            # The request should be authenticated.
            if not request.user.is_authenticated:
                raise exceptions.NotAuthenticated()

            return True

        return False
