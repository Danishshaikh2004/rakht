import { useEffect, useState } from 'react'
import { DatabaseService } from '../services/databaseService'

const ActiveRequests = () => {
  const [activeRequests, setActiveRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActiveRequests = async () => {
      try {
        const result = await DatabaseService.getActiveBloodRequests()
        if (result.success) {
          setActiveRequests(result.data)
        } else {
          setError(result.error || 'Failed to fetch active requests')
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch active requests')
      } finally {
        setLoading(false)
      }
    }
    fetchActiveRequests()
  }, [])

  if (loading) {
    return <div className="p-4">Loading active requests...</div>
  }

  if (error) {
    return <div className="p-4 text-red-600">Error: {error}</div>
  }

  if (activeRequests.length === 0) {
    return <div className="p-4">No active requests found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Active Blood Requests</h1>
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
