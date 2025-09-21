import asyncio
import os
from dotenv import load_dotenv

load_dotenv()

from ai.ai_agent import BloodDonationAgent

async def test_integration():
    """Test the AI integration"""

    # Initialize AI agent
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("DEEPSEEK_API_KEY")
    if not api_key:
        print("❌ API key not found. Please set OPENAI_API_KEY or DEEPSEEK_API_KEY")
        return

    agent = BloodDonationAgent(api_key)

    try:
        # Test 1: Register donors
        print("🧪 Testing donor registration...")

        donor_data = {
            "full_name": "Test Donor",
            "email": "test@example.com",
            "phone": "+1234567890",
            "blood_group": "O+",
            "location": "Mumbai, Maharashtra, India",
            "available_date": "2024-03-20",
            "available_time": "09:00-17:00"
        }

        result = await agent.register_donor(donor_data)
        print(f"✅ Donor registration: {'Success' if result['success'] else 'Failed'}")

        # Test 2: Process blood request
        print("\n🧪 Testing blood request processing...")

        request_data = {
            "patient_name": "Test Patient",
            "contact_email": "hospital@test.com",
            "contact_phone": "+1234567891",
            "blood_group": "O+",
            "hospital_name": "Test Hospital Mumbai",
            "urgency": "high",
            "units_needed": 2,
            "required_date": "2024-03-20"
        }

        result = await agent.process_blood_request(request_data)
        print(f"✅ Request processing: {'Success' if result['success'] else 'Failed'}")

        if result['success']:
            matches = result.get('matches', {})
            print(f"📊 Found {matches.get('total_matches', 0)} matching donors")

        # Test 3: System statistics
        print("\n🧪 Testing system statistics...")
        stats = await agent.get_system_stats()
        print(f"✅ System stats: {stats}")

        print("\n🎉 All tests completed successfully!")

    except Exception as e:
        print(f"❌ Test failed: {e}")
    finally:
        agent.close()

if __name__ == "__main__":
    asyncio.run(test_integration())
