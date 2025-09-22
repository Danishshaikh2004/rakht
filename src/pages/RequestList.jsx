import React, { useEffect, useState } from 'react';
import { DatabaseService } from '../services/databaseService';
import { Link } from 'react-router-dom';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const result = await DatabaseService.getActiveBloodRequests();
      if (result.success) {
        setRequests(result.data);
        setError(null);
      } else {
        setError(result.error || 'Failed to fetch requests');
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="p-4 text-center">Loading requests...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-600">Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request List</h1>
      {requests.length === 0 ? (
        <p>No active requests found.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((request) => (
            <li key={request.id} className="border rounded p-4 shadow-sm">
              <div className="font-semibold text-lg">{request.name || 'Unknown Name'}</div>
              <div>Blood Group: {request.bloodGroup || 'Unknown'}</div>
              <div>Hospital Location: {request.hospitalLocation || 'Unknown'}</div>
              <div>Urgency: {request.urgency || 'Normal'}</div>
              <div>Contact: {request.contact || 'N/A'}</div>
              <div>Request Type: {request.requestType || 'N/A'}</div>
              <div>Status: {request.status || 'N/A'}</div>
              <div>Prescription Details: {request.prescriptionDetails || 'N/A'}</div>
              <div>User Email: {request.userEmail || 'N/A'}</div>
              <div>User ID: {request.userId || 'N/A'}</div>
              <div>Created At: {formatDate(request.createdAt)}</div>
              <div>Updated At: {formatDate(request.updatedAt)}</div>
              <Link
                to="/request"
                className="inline-block mt-2 text-red-600 hover:underline"
              >
                View Request Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RequestList;
