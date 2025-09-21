import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminAccess = () => {
  const [accessCode, setAccessCode] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Simple admin access code - you can change this to whatever you want
  const ADMIN_ACCESS_CODE = 'bloodlink2024'

  const handleSubmit = (e) => {
    e.preventDefault()
    if (accessCode === ADMIN_ACCESS_CODE) {
      // Store admin access in session storage
      sessionStorage.setItem('adminAccess', 'granted')
      navigate('/admin')
    } else {
      setError('Invalid access code. Please try again.')
      setAccessCode('')
    }
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center" style={{paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="max-w-md w-full mx-4" style={{maxWidth: '448px', width: '100%', marginLeft: '16px', marginRight: '16px'}}>
        <div className="bg-white rounded-lg shadow-md p-8" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '32px'}}>
          {/* Header */}
          <div className="text-center mb-8" style={{marginBottom: '32px', textAlign: 'center'}}>
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4" style={{width: '64px', height: '64px', backgroundColor: '#dc2626', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: '16px'}}>
              <span className="text-white font-bold text-xl" style={{color: 'white', fontWeight: '700', fontSize: '20px'}}>BL</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>Admin Access</h1>
            <p className="text-gray-600" style={{color: '#4b5563'}}>Enter the admin access code to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6" style={{marginBottom: '24px'}}>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2" style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px'}}>
                Access Code
              </label>
              <input
                type="password"
                id="accessCode"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                style={{width: '100%', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', transition: 'all 0.2s ease'}}
                placeholder="Enter admin access code"
                required
              />
            </div>

            {error && (
              <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg" style={{marginBottom: '24px', padding: '12px', backgroundColor: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', borderRadius: '8px'}}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              style={{width: '100%', backgroundColor: '#dc2626', color: 'white', fontWeight: '600', padding: '12px 24px', borderRadius: '8px', transition: 'all 0.2s ease'}}
            >
              Access Admin Panel
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 text-center" style={{marginTop: '24px', textAlign: 'center'}}>
            <p className="text-sm text-gray-500" style={{fontSize: '14px', color: '#6b7280'}}>
              Admin access code: <code className="bg-gray-100 px-2 py-1 rounded text-xs" style={{backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px', fontSize: '12px'}}>bloodlink2024</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAccess
