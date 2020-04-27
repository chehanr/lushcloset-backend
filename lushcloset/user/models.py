from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import PermissionDenied
from django.core.validators import EmailValidator
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch.dispatcher import receiver
from django.utils.translation import gettext_lazy as _

from lushcloset.core.models.base import Base
from lushcloset.core.models.uuid import Uuid
from lushcloset.user.managers import CustomUserManager


class CustomUser(AbstractBaseUser, PermissionsMixin, Base, Uuid):
    """Custom user model that extends `AbstractUser`, `Base`, `Uuid`.

    Contains fields:
    - `email: str`
    - `name: str`
    - `is_staff: bool`
    - `is_active: bool`
    """

    email_validator = EmailValidator()

    username = None
    email = models.EmailField(
        _("email address"),
        unique=True,
        validators=[email_validator],
        error_messages={"unique": _("A user with that email already exists.")},
    )
    name = models.CharField(_("full name"), max_length=80)
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    class Meta:
        verbose_name = _("custom user")
        verbose_name_plural = _("custom users")

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)

    def __str__(self):
        return self.email


@receiver(pre_delete, sender=CustomUser)
def delete_user(sender, instance, **kwargs):
    # Prevent superuser deletion.
    if instance.is_superuser:
        raise PermissionDenied
