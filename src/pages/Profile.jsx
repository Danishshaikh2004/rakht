import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Profile = () => {
  const { currentUser, userProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    if (!currentUser) {
      navigate('/login')
      return
    }
    setLoading(false)
  }, [currentUser, navigate])

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account information</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                {userProfile?.displayName || currentUser.displayName || 'Not specified'}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                {currentUser.email}
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                {userProfile?.phone || 'Not specified'}
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 font-semibold">
                {userProfile?.bloodGroup || 'Not specified'}
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                {userProfile?.location || 'Not specified'}
              </div>
            </div>

            {/* Last Donation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Donation Date
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                {userProfile?.lastDonation
                  ? new Date(userProfile.lastDonation).toLocaleDateString()
                  : 'Not specified'
                }
              </div>
            </div>
          </div>

          {/* Registration Date */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Member Since
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900">
                {userProfile?.createdAt
                  ? new Date(userProfile.createdAt).toLocaleDateString()
                  : 'Recently'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/donate"
              className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 hover:bg-green-100 transition-colors"
            >
              <div className="mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Donate Blood</div>
                <div className="text-sm opacity-75">Save a life today</div>
              </div>
            </Link>

            <Link
              to="/request"
              className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 hover:bg-yellow-100 transition-colors"
            >
              <div className="mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Request Blood</div>
                <div className="text-sm opacity-75">Find donors</div>
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 hover:bg-blue-100 transition-colors"
            >
              <div className="mr-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div className="font-semibold">Dashboard</div>
                <div className="text-sm opacity-75">View statistics</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
