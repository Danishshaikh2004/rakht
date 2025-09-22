import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DatabaseService } from '../services/databaseService';

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('donors');
  const [pendingDonors, setPendingDonors] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [spamReports, setSpamReports] = useState([]);
  const navigate = useNavigate();

  // Check if admin access is granted
  useEffect(() => {
    const adminAccess = sessionStorage.getItem('adminAccess');
    if (adminAccess !== 'granted') {
      navigate('/admin-access');
    }
  }, [navigate]);

  // Fetch pending donors from Firestore
  const fetchPendingDonors = async () => {
    const result = await DatabaseService.getAllUsers();
    if (result.success) {
      // Filter donors with status 'pending' and requestType 'donation'
      const filteredDonors = result.data.filter(
        (user) => user.status === 'pending' && user.requestType === 'donation'
      );
      setPendingDonors(filteredDonors);
    }
  };

  // Fetch blood requests from Firestore
  const fetchBloodRequests = async () => {
    const result = await DatabaseService.getActiveBloodRequests();
    if (result.success) {
      setBloodRequests(result.data);
    }
  };

  // Fetch spam reports from Firestore
  const fetchSpamReports = async () => {
    const result = await DatabaseService.getAllSpamReports();
    if (result.success) {
      setSpamReports(result.data);
    }
  };

  useEffect(() => {
    fetchPendingDonors();
    fetchBloodRequests();
    fetchSpamReports();
  }, []);

  // Approve donor handler
  const handleApproveDonor = async (donorId) => {
    const result = await DatabaseService.updateUserProfile(donorId, { status: 'approved' });
    if (result.success) {
      alert(`Donor ${donorId} approved successfully!`);
      fetchPendingDonors();
    } else {
      alert(`Failed to approve donor: ${result.error}`);
    }
  };

  // Reject donor handler
  const handleRejectDonor = async (donor) => {
    // Add donor to spam reports
    const reportData = {
      reporter: donor.email,
      type: 'Donor Rejection',
      description: `Donor ${donor.name} rejected by admin.`,
      reportedAt: new Date().toISOString()
    };
    const addSpamResult = await DatabaseService.addDonorToSpamReports(donor.id, reportData);
    if (addSpamResult.success) {
      // Remove donor from users collection
      const removeResult = await DatabaseService.removeDonor(donor.id);
      if (removeResult.success) {
        alert(`Donor ${donor.name} rejected and moved to spam reports.`);
        fetchPendingDonors();
        fetchSpamReports();
      } else {
        alert(`Failed to remove donor: ${removeResult.error}`);
      }
    } else {
      alert(`Failed to add donor to spam reports: ${addSpamResult.error}`);
    }
  };

  const handleViewDocument = (documentName) => {
    alert(`Opening ${documentName}...`);
  };

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage BloodLink operations and monitor system activity</p>
        </div>

        {/* Navigation Sidebar */}
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('donors')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'donors' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Donor Verifications
                </button>
                <button
                  onClick={() => setActiveSection('requests')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'requests' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Blood Requests
                </button>
                <button
                  onClick={() => setActiveSection('spam')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'spam' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  Spam Reports
                </button>
                <button
                  onClick={() => setActiveSection('metrics')}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === 'metrics' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  System Metrics
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {activeSection === 'donors' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Donor Verifications</h2>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {pendingDonors.length} Pending
                  </span>
                </div>

                {pendingDonors.map((donor) => (
                  <div key={donor.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{donor.name}</h3>
                        <p className="text-gray-600">{donor.email}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-600 text-white rounded-full text-sm font-medium">
                        {donor.bloodGroup}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Location:</span>
                        <span className="ml-2">{donor.location}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Available Date:</span>
                        <span className="ml-2">{donor.availableDate}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Available Time:</span>
                        <span className="ml-2">{donor.availableTime}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Last Donation:</span>
                        <span className="ml-2">{donor.lastDonation || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Request Type:</span>
                        <span className="ml-2">{donor.requestType}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Status:</span>
                        <span className="ml-2">{donor.status}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Documents:</h4>
                      <div className="flex flex-wrap gap-2">
                        {donor.documents && donor.documents.length > 0 ? (
                          donor.documents.map((doc, index) => (
                            <button
                              key={index}
                              onClick={() => handleViewDocument(doc)}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 transition-colors"
                            >
                              📄 {doc}
                            </button>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No documents available</p>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApproveDonor(donor.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectDonor(donor)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'requests' && (
              <div className="space-y-6">
                {bloodRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-lg shadow-md p-6 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.requester}</h3>
                        <p className="text-gray-600">{request.location}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${request.urgency === 'immediate' ? 'bg-red-100 text-red-800' : request.urgency === 'today' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                          {request.urgency === 'immediate' ? 'Immediate' : request.urgency === 'today' ? 'Today' : 'Scheduled'}
                        </span>
                        <div className="mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                            {request.status === 'pending' ? 'Pending' : 'Matched'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Blood Group:</span>
                        <span className="ml-2 text-red-600 font-semibold">{request.bloodGroup}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Submitted:</span>
                        <span className="ml-2">{new Date(request.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Request Details:</h4>
                      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        {JSON.stringify(request, null, 2)}
                      </pre>
                    </div>

                    <div className="flex space-x-3">
                      <button className="bg-gray-100 text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-lg">Contact Requester</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'spam' && (
              <div className="space-y-6">
                {spamReports.map((report) => (
                  <div key={report.id} className="bg-white rounded-lg shadow-md p-6 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Report #{report.id}</h3>
                        <p className="text-gray-600">Reported by: {report.reporter}</p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                        {report.type}
                      </span>
                    </div>

                    <p className="text-gray-700">{report.description}</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Reported:</span> <span className="ml-2">{new Date(report.reportedAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex space-x-3">
                      <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Block User</button>
                      <button className="bg-gray-100 text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-lg">Investigate</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'metrics' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">System Metrics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-3xl font-bold text-red-600">{systemMetrics.totalDonors.toLocaleString()}</div>
                    <div className="text-gray-600">Total Donors</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600">{systemMetrics.activeRequests}</div>
                    <div className="text-gray-600">Active Requests</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-3xl font-bold text-green-600">{systemMetrics.totalUsers.toLocaleString()}</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600">{systemMetrics.monthlyDonations.toLocaleString()}</div>
                    <div className="text-gray-600">Monthly Donations</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg">Export Data</button>
                    <button className="bg-gray-100 text-gray-700 border border-gray-300 font-medium py-2 px-4 rounded-lg">Send Notifications</button>
                    <button className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg">System Settings</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
