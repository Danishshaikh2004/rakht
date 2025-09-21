import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class DonorMatchingEngine:
    # Blood type compatibility matrix
    COMPATIBILITY_MATRIX = {
        'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
        'O+': ['O+', 'A+', 'B+', 'AB+'],
        'A-': ['A-', 'A+', 'AB-', 'AB+'],
        'A+': ['A+', 'AB+'],
        'B-': ['B-', 'B+', 'AB-', 'AB+'],
        'B+': ['B+', 'AB+'],
        'AB-': ['AB-', 'AB+'],
        'AB+': ['AB+']
    }

    def __init__(self):
        # Placeholder for donor database or data source
        self.donors = []

    def add_donor(self, donor):
        self.donors.append(donor)

    def is_compatible(self, donor_blood, recipient_blood):
        return recipient_blood in self.COMPATIBILITY_MATRIX.get(donor_blood, [])

    def calculate_proximity_score(self, donor_coords, hospital_coords):
        from math import radians, cos, sin, asin, sqrt
        lat1, lon1 = donor_coords
        lat2, lon2 = hospital_coords

        # Haversine formula
        dlat = radians(lat2 - lat1)
        dlon = radians(lon2 - lon1)
        a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a))
        r = 6371  # Earth radius in km
        distance = c * r

        # Proximity score inversely proportional to distance
        score = max(0, 100 - distance)
        return score

    def find_compatible_donors(self, blood_group, latitude, longitude, urgency, units_needed, required_date):
        compatible_donors = []
        hospital_coords = (latitude, longitude)
        required_date_obj = datetime.strptime(required_date, "%Y-%m-%d")

        for donor in self.donors:
            try:
                donor_blood = donor.get('blood_group')
                donor_coords = (donor.get('latitude'), donor.get('longitude'))
                donor_available_date = datetime.strptime(donor.get('available_date'), "%Y-%m-%d")

                if not self.is_compatible(donor_blood, blood_group):
                    continue

                if donor_available_date > required_date_obj:
                    continue

                proximity_score = self.calculate_proximity_score(donor_coords, hospital_coords)

                # Urgency prioritization (simple example)
                urgency_score = 50 if urgency == 'high' else 20

                total_score = proximity_score + urgency_score

                compatible_donors.append({
                    'donor': donor,
                    'score': total_score
                })
            except Exception as e:
                logger.error(f"Error processing donor {donor}: {e}")

        # Sort donors by score descending
        compatible_donors.sort(key=lambda x: x['score'], reverse=True)

        # Return top matches and summary
        top_donors = [d['donor'] for d in compatible_donors[:units_needed]]

        return {
            'total_matches': len(compatible_donors),
            'donors': top_donors
        }
