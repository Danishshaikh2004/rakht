import requests
import logging
from collections import namedtuple
from functools import lru_cache

logger = logging.getLogger(__name__)

Coordinates = namedtuple('Coordinates', ['latitude', 'longitude', 'formatted_address', 'display_name'])

class GeocodingService:
    def __init__(self):
        self.nominatim_url = "https://nominatim.openstreetmap.org/search"
        self.headers = {'User-Agent': 'BloodDonationAI/1.0'}

    @lru_cache(maxsize=128)
    def geocode(self, location_text):
        params = {
            'q': location_text,
            'format': 'json',
            'limit': 1
        }
        try:
            response = requests.get(self.nominatim_url, params=params, headers=self.headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data:
                place = data[0]
                return Coordinates(
                    latitude=float(place['lat']),
                    longitude=float(place['lon']),
                    formatted_address=place.get('display_name', ''),
                    display_name=place.get('display_name', '')
                )
            else:
                logger.warning(f"No geocoding result for location: {location_text}")
                return None
        except Exception as e:
            logger.error(f"Geocoding error for location '{location_text}': {e}")
            return None

    def get_donor_coordinates(self, location_text):
        return self.geocode(location_text)

    def get_hospital_coordinates(self, location_text):
        return self.geocode(location_text)

    def calculate_distance(self, coord1, coord2):
        from math import radians, cos, sin, asin, sqrt
        lat1, lon1 = coord1
        lat2, lon2 = coord2

        # Haversine formula
        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)
        a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Radius of earth in kilometers
        return c * r
