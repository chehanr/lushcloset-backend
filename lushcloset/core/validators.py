from django.core import exceptions
from django.utils import timezone

from lushcloset import strings


def validate_date_est_return(value):
    """ 
    The estimated return date must be after today. 
    
    TODO:
    - Add more constraints. 
    """

    if value < timezone.now():
        raise exceptions.ValidationError(strings.DATE_LESS_THAN)

    return value
