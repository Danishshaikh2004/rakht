import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AuthService } from '../services/authService'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    setErrors({})

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Redirect to home page after successful login
        navigate('/')
      } else {
        setErrors({ general: result.error || 'Login failed. Please check your credentials.' })
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true)
    setErrors({})

    try {
      const result = await AuthService.signInWithGoogle()

      if (result.success) {
        // Redirect to home page after successful Google sign-in
        navigate('/')
      } else {
        setErrors({ general: result.error || 'Google sign-in failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ general: 'Google sign-in failed. Please try again.' })
    } finally {
      setIsGoogleSigningIn(false)
    }
  }

  return (
    <div style={{
      paddingTop: '64px',
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: '448px',
        width: '100%',
        marginLeft: '16px',
        marginRight: '16px'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '24px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#dc2626',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <span style={{ color: 'white', fontWeight: '700', fontSize: '20px' }}>BL</span>
            </div>
            <h1 style={{
              fontSize: '30px',
              fontWeight: '700',
              color: '#111827',
              marginBottom: '8px'
            }}>Welcome Back</h1>
            <p style={{ color: '#4b5563' }}>Sign in to your BloodLink account</p>
          </div>

          {/* General Error Display */}
          {errors.general && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              fontSize: '14px'
            }}>
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email */}
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  borderColor: errors.email ? '#ef4444' : '#d1d5db',
                  boxShadow: errors.email ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
                }}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  borderColor: errors.password ? '#ef4444' : '#d1d5db',
                  boxShadow: errors.password ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
                }}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ height: '16px', width: '16px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <label htmlFor="remember-me" style={{ marginLeft: '8px', fontSize: '14px', color: '#374151' }}>
                  Remember me
                </label>
              </div>

              <div style={{ fontSize: '14px' }}>
                <a href="#" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '500' }}>
                  Forgot your password?
                </a>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: '600',
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                opacity: isSubmitting ? '0.5' : '1'
              }}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ marginTop: '24px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center' }}>
                <div style={{ width: '100%', borderTop: '1px solid #d1d5db' }} />
              </div>
              <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', fontSize: '14px' }}>
                <span style={{ padding: '0 8px', backgroundColor: 'white', color: '#6b7280' }}>Or</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div style={{ marginTop: '24px' }}>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isGoogleSigningIn}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: isGoogleSigningIn ? '#f3f4f6' : 'white',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#374151',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  cursor: isGoogleSigningIn ? 'not-allowed' : 'pointer',
                  opacity: isGoogleSigningIn ? '0.5' : '1',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg viewBox="0 0 24 24" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isGoogleSigningIn ? 'Signing in with Google...' : 'Continue with Google'}
              </button>
            </div>
          </div>

          {/* Register link */}
          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#4b5563' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '500' }}>
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
