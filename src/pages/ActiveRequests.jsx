  import { useEffect, useState } from 'react'
import { DatabaseService } from '../services/databaseService'
import { useAuth } from '../contexts/AuthContext'

const ActiveRequests = () => {
  const { currentUser } = useAuth()
  const [activeRequests, setActiveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDonorNearbyRequests = async () => {
      if (!currentUser) {
        setActiveRequests([])
        setLoading(false)
        return
      }
      try {
        // Fetch donor profile to get nearbyRequests IDs
        const profileResult = await DatabaseService.getUserProfile(currentUser.uid)
        if (!profileResult.success) {
          setError(profileResult.error || 'Failed to fetch user profile')
          setLoading(false)
          return
        }
        const nearbyRequestIds = profileResult.data.nearbyRequests || []
        if (nearbyRequestIds.length === 0) {
          setActiveRequests([])
          setLoading(false)
          return
        }
        // Fetch details for each nearby request ID
        const requests = []
        for (const requestId of nearbyRequestIds) {
          // Assuming getUserProfile cannot fetch request by ID, so implement getRequestById
          const requestDoc = await DatabaseService.getRequestById(requestId)
          if (requestDoc && requestDoc.success) {
            requests.push({ id: requestId, ...requestDoc.data })
          }
        }
        setActiveRequests(requests)
      } catch (err) {
        setError(err.message || 'Failed to fetch nearby requests')
      } finally {
        setLoading(false)
      }
    }
    fetchDonorNearbyRequests()
  }, [currentUser])

  if (loading) {
    return <div className="p-4">Loading nearby requests...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>
  }

  if (activeRequests.length === 0) {
    return <div className="p-4">No nearby requests found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Blood Requests</h1>
      <ul className="space-y-4">
        {activeRequests.map((request) => (
          <li key={request.id} className="border border-gray-300 rounded p-4 shadow hover:shadow-md transition-shadow">
            <div className="font-semibold text-lg">{request.patient_name || 'Unknown Patient'}</div>
            <div>Blood Group: {request.blood_group || 'Unknown'}</div>
            <div>Hospital: {request.hospital_name || 'Unknown'}</div>
            <div>Urgency: {request.urgency || 'Normal'}</div>
            <div>Required Date: {request.required_date || 'N/A'}</div>
            <div>Contact Email: {request.contact_email || 'N/A'}</div>
            <div>Contact Phone: {request.contact_phone || 'N/A'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActiveRequests
