from django.urls import include, path

import lushcloset.api.v1_0.urls as v1_0urls

urlpatterns = [
    path("v1_0/", include(("lushcloset.api.v1_0.urls", "api-v1.0"), namespace="v1.0"),),
]
