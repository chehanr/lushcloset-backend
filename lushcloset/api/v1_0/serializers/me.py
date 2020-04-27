
from django.contrib.auth import get_user_model
from rest_framework import serializers


class MeRetrieveSerializer(serializers.ModelSerializer):
    """Retrieve serializer for authenticated user (`Me`).

    Contains fields:
    - `uuid`
    - `email`
    - `name`
    - `is_staff`
    - `date_created`
    """

    class Meta:
        model = get_user_model()
        fields = (
            "uuid",
            "email",
            "name",
            "is_staff",
            "date_created",
        )

class MeUpdateSerializer(serializers.ModelSerializer):
    """Update serializer for authenticated user (`Me`).

    Contains fields:
    - `uuid`
    - `email`
    - `name`
    """

    class Meta:
        model = get_user_model()
        fields = (
            "uuid",
            "email",
            "name",
        )
