from rest_framework import status
from rest_framework.exceptions import APIException


class UserCreationNotAllowed(APIException):
    status_code = status.HTTP_405_METHOD_NOT_ALLOWED
    default_detail = "You are not allowed to create a user account."
    default_code = "user_creation_not_allowed"


class QueryParamNotFoundNotFound(APIException):
    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "You are missing a required query parameter."
    default_code = "query_param_not_found"
