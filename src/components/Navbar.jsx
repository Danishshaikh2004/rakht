import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const isActive = (path) => location.pathname === path

  const handleProfileClick = () => {
    navigate('/profile')
  }

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
