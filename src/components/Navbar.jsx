import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { DatabaseService } from '../services/databaseService'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [activeRequests, setActiveRequests] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const isActive = (path) => location.pathname === path

  const handleProfileClick = () => {
    navigate('/profile')
  }

  useEffect(() => {
    const fetchActiveRequests = async () => {
      const result = await DatabaseService.getActiveBloodRequests()
      if (result.success) {
        setActiveRequests(result.data)
      }
    }
    fetchActiveRequests()
  }, [])

  return (
    <nav className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">BL</span>
            </div>
            <span className="text-xl font-bold text-gray-800">BloodLink</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'text-red-600' : ''}`}
            >
              Home
            </Link>
            <Link
              to="/donate"
              className={`nav-link ${isActive('/donate') ? 'text-red-600' : ''}`}
            >
              Donate
            </Link>
            <Link
              to="/request"
              className={`nav-link ${isActive('/request') ? 'text-red-600' : ''}`}
            >
              Request
            </Link>
            <Link
              to="/contact"
              className={`nav-link ${isActive('/contact') ? 'text-red-600' : ''}`}
            >
              Contact
            </Link>
            <Link
              to="/request-list"
              className={`nav-link ${isActive('/request-list') ? 'text-red-600' : ''}`}
            >
              Request List
            </Link>

            {/* Active Requests */}
            <div className="relative">
              <button
                className="nav-link cursor-pointer flex items-center space-x-1"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span>Active Requests</span>
                {activeRequests.length > 0 && (
                  <span className="ml-1 bg-red-600 text-white rounded-full px-2 text-xs font-semibold">
                    {activeRequests.length}
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                  {activeRequests.length === 0 ? (
                    <div className="p-4 text-gray-500">No active requests</div>
                  ) : (
                    activeRequests.map((request) => (
                      <Link
                        key={request.id}
                        to="/active-requests"
                        className="block p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="font-semibold text-sm">{request.patient_name || 'Unknown Patient'}</div>
                        <div className="text-xs text-gray-600">{request.blood_group || 'Unknown Blood Group'}</div>
                        <div className="text-xs text-gray-600">{request.hospital_name || 'Unknown Hospital'}</div>
                        <div className="text-xs text-gray-600">Urgency: {request.urgency || 'Normal'}</div>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Authentication Section */}
            {currentUser ? (
              // Logged in user - show profile icon
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-center w-10 h-10 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                title="View Profile"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            ) : (
              // Not logged in - show login and register buttons
              <>
                <Link
                  to="/login"
                  className={`nav-link ${isActive('/login') ? 'text-red-600' : ''}`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
