
from django.contrib.auth import get_user_model, hashers
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


class UserCreateSerializer(serializers.ModelSerializer):
    """Create serializer for `Users`.

    Contains fields:
    - `uuid`
    - `name`
    - `email`
    - `password`
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password', 'placeholder': 'Password'}
    )

    class Meta:
        model = get_user_model()
        fields = (
            "uuid",
            "name",
            "email",
            "password",
        )


    def create(self, validated_data):
        validated_data['password'] = hashers.make_password(validated_data.get('password'))
        
        return super(UserCreateSerializer, self).create(validated_data)
