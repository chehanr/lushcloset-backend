from django.contrib.auth import get_user_model
from django.core import exceptions
from django.db import models
from django.utils.translation import gettext_lazy as _

from lushcloset import strings
from lushcloset.core.models.base import Base
from lushcloset.core.models.processed_request import ProcessedRequest
from lushcloset.core.models.uuid import Uuid
from lushcloset.core.validators import validate_date_est_return


class Request(Base, Uuid):
    """
    Request that extends `Base` and `Uuid`.

    Contains fields:
    - `listing: Listing`
    - `sender: User`
    - `date_est_return: date`
    - `note: str`
    """

    listing = models.ForeignKey("core.Listing", on_delete=models.CASCADE,)
    sender = models.ForeignKey(get_user_model(), on_delete=models.CASCADE,)
    date_est_return = models.DateTimeField(validators=[validate_date_est_return,])
    note = models.CharField(max_length=100, blank=True, null=True,)

    class Meta:
        verbose_name = _("Request")
        verbose_name_plural = _("Requests")
        # constraints = [
        #     models.UniqueConstraint(
        #         fields=["listing", "sender"], name="listing_sender_unique_constraint"
        #     )
        # ]

    def clean(self, *args, **kwargs):
        """
        The `listing` and `sender` combination should be unique unless
        the `ProcessedRequest`'s `request_status` is set to `COMPLETED`. 
        
        """

        # Check if the request has been processed.
        p_request_objs = ProcessedRequest.objects.filter(
            request__listing=self.listing, request__sender=self.sender,
        )

        if len(p_request_objs) > 0:
            # `ProcessedRequest` objects exists.

            # Get the last processed request.
            l_p_request_obj = p_request_objs.order_by("-date_created",)[0]

            if not l_p_request_obj.request_status == "COMPLETED":
                # The request has been processed but it's not completed.

                raise exceptions.ValidationError(strings.REQUEST_NOT_COMPLETED)
        else:
            # Not processed yet.
            if Request.objects.filter(
                listing=self.listing, sender=self.sender,
            ).exists():
                raise exceptions.ValidationError(strings.REQUEST_ALREADY_EXISTS)

        super(Request, self).clean(*args, **kwargs)

    def __str__(self):
        return f"Request: {self.uuid}"
