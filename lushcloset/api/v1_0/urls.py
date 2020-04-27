from django.urls import path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

from lushcloset.api.v1_0.views.listing import ListingViewSet
from lushcloset.api.v1_0.views.listing_image import ListingImageViewSet
from lushcloset.api.v1_0.views.me import MeView
from lushcloset.api.v1_0.views.user import UserViewSet

app_name = "api-v1.0"

urlpatterns = [
    path("auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path("me/", MeView.as_view(), name="me"),
]

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")
router.register(r"listings", ListingViewSet, basename="listings")
router.register(r"listing_images", ListingImageViewSet, basename="listing_images")

urlpatterns.extend(router.urls)
