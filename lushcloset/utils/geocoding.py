import googlemaps
from django.conf import settings


def get_geocodings(address: str):
    gmaps = googlemaps.Client(key=settings.GEOCODING_API_KEY)

    return gmaps.geocode(address)


def get_reverse_geocodings(lat: float, lng: float):
    gmaps = googlemaps.Client(key=settings.GEOCODING_API_KEY)

    return gmaps.reverse_geocode((lat, lng))
