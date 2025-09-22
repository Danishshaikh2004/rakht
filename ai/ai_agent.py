"""
AI Agent to use tools and suggest donors for nearby requests
"""

import asyncio
from typing import List, Dict, Any
from ai.donor_matching import DonorDrivenMatchingEngine, Donor, BloodRequest
from ai.geocoding_service import GeocodingService
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'src', 'services')))
from databaseService import DatabaseService


class AIAgent:
    """
    AI Agent to use tools and suggest donors for nearby requests
    """
    def __init__(self):
        self.geocoder = GeocodingService()
        self.matcher = DonorDrivenMatchingEngine()

    async def fetch_donors(self) -> List[Donor]:
        """
        Fetch donors from database and convert to Donor dataclass list
        """
        # Assuming donors are stored in 'users' collection with donor info
        result = await asyncio.to_thread(DatabaseService.getAllUsers)
        donors = []
        if result['success']:
            for user in result['data']:
                if user.get('isDonor', False):
                    try:
                        latitude = user.get('latitude', 0.0)
                        longitude = user.get('longitude', 0.0)
                        location_text = user.get('location', '')
                        # Perform geocoding if coordinates are missing or zero
                        if not latitude or not longitude:
                            coords = self.geocoder.get_coordinates(location_text)
                            latitude = coords.latitude
                            longitude = coords.longitude
                        donor = Donor(
                            id=user.get('id', ''),
                            full_name=user.get('full_name', ''),
                            email=user.get('email', ''),
                            phone=user.get('phone', ''),
                            blood_group=user.get('bloodGroup', ''),
                            latitude=latitude,
                            longitude=longitude,
                            location_text=location_text,
                            formatted_address=user.get('formattedAddress', ''),
                            available_date=user.get('availableDate', ''),
                            available_time=user.get('availableTime', ''),
                            last_donation_date=user.get('lastDonation', None),
                            is_active=user.get('isActive', True),
                            created_at=None
                        )
                        donors.append(donor)
                    except Exception as e:
                        # Log or handle error
                        pass
        return donors

    async def fetch_requests(self) -> List[BloodRequest]:
        """
        Fetch active blood requests from database and convert to BloodRequest dataclass list
        """
        result = await asyncio.to_thread(DatabaseService.getActiveBloodRequests)
        requests = []
        if result['success']:
            for req in result['data']:
                try:
                    request = BloodRequest(
                        id=req.get('id', ''),
                        patient_name=req.get('patient_name', ''),
                        contact_email=req.get('contact_email', ''),
                        contact_phone=req.get('contact_phone', ''),
                        blood_group=req.get('blood_group', ''),
                        hospital_name=req.get('hospital_name', ''),
                        latitude=req.get('latitude', 0.0),
                        longitude=req.get('longitude', 0.0),
                        hospital_address=req.get('hospital_address', ''),
                        urgency=req.get('urgency', 'normal'),
                        units_needed=req.get('units_needed', 1),
                        required_date=req.get('required_date', ''),
                        required_time=req.get('required_time', None),
                        created_at=None,
                        is_active=req.get('is_active', True)
                    )
                    requests.append(request)
                except Exception as e:
                    # Log or handle error
                    pass
        return requests

    async def suggest_donors_for_nearby_requests(self) -> Dict[str, List[Any]]:
        """
        Suggest donors for nearby requests using matching engine
        Returns a dict mapping donor id to list of matched requests
        """
        donors = await self.fetch_donors()
        requests = await self.fetch_requests()

        suggestions = {}

        for donor in donors:
            matches = self.matcher.find_nearby_requests_for_donor(donor, requests)
            suggestions[donor.id] = matches
            # Save matched requests to donor profile in database
            try:
                matched_request_ids = [match.request.id for match in matches]
                await asyncio.to_thread(DatabaseService.updateUserProfile, donor.id, {'nearbyRequests': matched_request_ids})
            except Exception as e:
                # Log or handle error
                pass

        return suggestions


# Example usage
async def main():
    agent = AIAgent()
    suggestions = await agent.suggest_donors_for_nearby_requests()
    for donor_id, matches in suggestions.items():
        print(f"Donor {donor_id} matches:")
        for match in matches:
            print(f"  Request {match.request.id} - Patient: {match.request.patient_name}, Distance: {match.distance_km} km, Score: {match.overall_score}")


if __name__ == "__main__":
    asyncio.run(main())
