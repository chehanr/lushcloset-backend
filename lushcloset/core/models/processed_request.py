from enum import Enum

from django.db import models
from django.utils.translation import gettext_lazy as _

from lushcloset.core.models.base import Base
from lushcloset.core.models.uuid import Uuid


class ApprovalStatus(Enum):
    APPROVED = "Approved"
    DISAPPROVED = "Disapproved"


class RequestStatus(Enum):
    COMPLETED = "Completed"
    NOT_COMPLETED = "Not completed"


class ProcessedRequest(Base, Uuid):
    """
    Processed Request that extends `Base` and `Uuid`.

    Contains fields:
    - `request: Request`
    - `approval_status: Enum`
    - `request_status: Enum`
    """

    request = models.OneToOneField("core.Request", on_delete=models.CASCADE,)
    approval_status = models.CharField(
        max_length=20,
        choices=[(status.name, status.value) for status in ApprovalStatus],
        default=ApprovalStatus.DISAPPROVED,
    )
    request_status = models.CharField(
        max_length=20,
        choices=[(status.name, status.value) for status in RequestStatus],
        default=RequestStatus.NOT_COMPLETED,
    )

    class Meta:
        verbose_name = _("Processed Request")
        verbose_name_plural = _("Processed Requests")

    def __str__(self):
        return f"Processed Request: {self.uuid}"
