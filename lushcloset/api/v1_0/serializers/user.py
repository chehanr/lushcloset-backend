
from django.contrib.auth import get_user_model
from rest_framework import serializers


class UserRetrieveSerializer(serializers.ModelSerializer):
    """Retrieve serializer for `Users`.

    Contains fields:
    - `uuid`
    - `name`
    """

    class Meta:
        model = get_user_model()
        fields = (
            "uuid",
            "name",
        )
