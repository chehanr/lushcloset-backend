from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from django.utils.translation import ugettext_lazy as _

from lushcloset.user.models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(DjangoUserAdmin):
    """Define admin model for custom User model."""

    list_display = (
        "email",
        "date_created",
        "is_staff",
    )
    search_fields = (
        "name",
        "email",
    )
    fieldsets = (
        (None, {"fields": ("email", "password", "uuid",)}),
        (_("Personal info"), {"fields": ("name",)}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_created",)},),
    )
    readonly_fields = (
        "uuid",
        "date_created",
    )
    ordering = ("name",)

    def get_fieldsets(self, request, obj=None, *args, **kwargs):
        # Non superuser fieldsets.
        fieldsets = (
            (None, {"fields": ("password", "uuid",)}),
            (_("Personal info"), {"fields": ("name", "email",)}),
            (_("Important dates"), {"fields": ("last_login", "date_created",)},),
        )

        add_fieldsets = (
            (
                None,
                {
                    "classes": ("wide",),
                    "fields": ("name", "email", "password1", "password2",),
                },
            ),
        )

        if not obj:
            return add_fieldsets

        if not request.user.is_superuser:
            return fieldsets

        return super(CustomUserAdmin, self).get_fieldsets(request, obj, *args, **kwargs)

    def get_readonly_fields(self, request, obj=None, *args, **kwargs):
        readonly_fields = [
            "uuid",
            "date_created",
            "last_login",
        ]

        if not request.user.is_superuser:
            # Disable fields if user is a superuser.
            if obj and obj.is_superuser:
                readonly_fields.extend(["name", "email"])

            return tuple(readonly_fields)

        return super(CustomUserAdmin, self).get_readonly_fields(
            request, obj, *args, **kwargs
        )
