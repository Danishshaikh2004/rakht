import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import emailService from '../services/emailService'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    bloodGroup: '',
    location: '',
    lastDonation: ''
  })

  const [acceptTerms, setAcceptTerms] = useState(false)
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingOTP, setIsSendingOTP] = useState(false)
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [canResendOTP, setCanResendOTP] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [currentStep, setCurrentStep] = useState(1)

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const totalSteps = 3

  // Cooldown timer for resend OTP
  useEffect(() => {
    let interval;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            setCanResendOTP(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const validateStep1 = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

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

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits'
    }

    if (!formData.bloodGroup) {
      newErrors.bloodGroup = 'Blood group is required'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (!acceptTerms) {
      newErrors.acceptTerms = 'You must accept the Terms and Conditions to continue'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (!otp.trim()) {
      newErrors.otp = 'OTP is required'
    } else if (!/^\d{6}$/.test(otp)) {
      newErrors.otp = 'OTP must be 6 digits'
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

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setOtp(value)

    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: ''
      }))
    }
  }

  const handleSendOTP = async () => {
    if (!validateStep1()) {
      return
    }

    setIsSendingOTP(true)
    setMessage('')
    setMessageType('')

    try {
      const result = await emailService.sendOTP(formData.email)

      if (result.success) {
        setCurrentStep(2)
        setMessage(result.message)
        setMessageType('success')
        setCanResendOTP(false)
        setResendCooldown(60) // 60 seconds cooldown
      } else {
        setMessage(result.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Failed to send OTP. Please try again.')
      setMessageType('error')
    } finally {
      setIsSendingOTP(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!validateStep2()) {
      return
    }

    setIsVerifyingOTP(true)
    setMessage('')
    setMessageType('')

    try {
      const result = await emailService.verifyOTP(formData.email, otp)

      if (result.success) {
        setCurrentStep(3)
        setMessage(result.message)
        setMessageType('success')
      } else {
        setMessage(result.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Failed to verify OTP. Please try again.')
      setMessageType('error')
    } finally {
      setIsVerifyingOTP(false)
    }
  }

  const handleResendOTP = async () => {
    if (!canResendOTP) return

    setIsSendingOTP(true)
    setMessage('')
    setMessageType('')

    try {
      const result = await emailService.resendOTP(formData.email)

      if (result.success) {
        setMessage('OTP resent successfully!')
        setMessageType('success')
        setCanResendOTP(false)
        setResendCooldown(60) // 60 seconds cooldown
      } else {
        setMessage(result.message)
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Failed to resend OTP. Please try again.')
      setMessageType('error')
    } finally {
      setIsSendingOTP(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsSubmitting(true)
    setMessage('')
    setMessageType('')

    try {
      // Register user with Firebase authentication and database
      const result = await register(formData.email, formData.password, formData)

      if (result.success) {
        setMessage('Registration successful! Please login with your email to continue.')
        setMessageType('success')

        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setMessage(result.error || 'Registration failed. Please try again.')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Registration failed. Please try again.')
      setMessageType('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepIndicator = () => {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        {[1, 2, 3].map((step) => (
          <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: step <= currentStep ? '#dc2626' : '#e5e7eb',
                color: step <= currentStep ? 'white' : '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                style={{
                  width: '64px',
                  height: '2px',
                  backgroundColor: step < currentStep ? '#dc2626' : '#e5e7eb',
                  margin: '0 16px',
                  transition: 'all 0.2s ease'
                }}
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderStep1 = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Personal Information
        </h2>
        <p style={{ color: '#4b5563' }}>Please provide your basic information</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${errors.fullName ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: errors.fullName ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
            placeholder="Enter your full name"
          />
          {errors.fullName && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Email Address *
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
              border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: errors.email ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Password *
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
              border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: errors.password ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.password}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: errors.confirmPassword ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.confirmPassword}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${errors.phone ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: errors.phone ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.phone}</p>
          )}
        </div>

        {/* Blood Group */}
        <div>
          <label htmlFor="bloodGroup" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Blood Group *
          </label>
          <select
            id="bloodGroup"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${errors.bloodGroup ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: errors.bloodGroup ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
          >
            <option value="">Select your blood group</option>
            {bloodGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
          {errors.bloodGroup && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.bloodGroup}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${errors.location ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              boxShadow: errors.location ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
            placeholder="Enter your city or address"
          />
          {errors.location && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.location}</p>
          )}
        </div>

        {/* Last Donation Date */}
        <div>
          <label htmlFor="lastDonation" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Last Donation Date
          </label>
          <input
            type="date"
            id="lastDonation"
            name="lastDonation"
            value={formData.lastDonation}
            onChange={handleInputChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              transition: 'all 0.2s ease'
            }}
          />
        </div>

        {/* Terms and Conditions */}
        <div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <input
              type="checkbox"
              id="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '2px',
                accentColor: '#dc2626',
                cursor: 'pointer'
              }}
            />
            <div style={{ flex: 1 }}>
              <label htmlFor="acceptTerms" style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5', cursor: 'pointer' }}>
                I agree to the{' '}
                <Link
                  to="/terms-and-conditions"
                  style={{
                    color: '#dc2626',
                    textDecoration: 'none',
                    fontWeight: '600',
                    borderBottom: '1px solid transparent',
                    transition: 'border-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.borderBottom = '1px solid #dc2626'}
                  onMouseLeave={(e) => e.target.style.borderBottom = '1px solid transparent'}
                >
                  Terms and Conditions
                </Link>
                {' '}and understand that providing false information or misusing this platform may result in legal action. *
              </label>
            </div>
          </div>
          {errors.acceptTerms && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.acceptTerms}</p>
          )}
        </div>
      </div>

      <button
        onClick={handleSendOTP}
        disabled={isSendingOTP}
        style={{
          width: '100%',
          backgroundColor: '#dc2626',
          color: 'white',
          fontWeight: '600',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          opacity: isSendingOTP ? '0.5' : '1',
          cursor: isSendingOTP ? 'not-allowed' : 'pointer',
          marginTop: '24px'
        }}
      >
        {isSendingOTP ? 'Sending OTP...' : 'Send OTP to Email'}
      </button>
    </div>
  )

  const renderStep2 = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Verify Email
        </h2>
        <p style={{ color: '#4b5563' }}>
          We've sent a 6-digit OTP to <strong>{formData.email}</strong>
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* OTP Input */}
        <div>
          <label htmlFor="otp" style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
            Enter OTP *
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={handleOTPChange}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${errors.otp ? '#ef4444' : '#d1d5db'}`,
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: '600',
              textAlign: 'center',
              letterSpacing: '4px',
              transition: 'all 0.2s ease',
              boxShadow: errors.otp ? '0 0 0 3px rgba(239, 68, 68, 0.5)' : ''
            }}
            placeholder="000000"
            maxLength="6"
          />
          {errors.otp && (
            <p style={{ marginTop: '4px', fontSize: '14px', color: '#dc2626' }}>{errors.otp}</p>
          )}
        </div>

        {/* Resend OTP */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>
            Didn't receive the OTP?
          </p>
          <button
            onClick={handleResendOTP}
            disabled={!canResendOTP || isSendingOTP}
            style={{
              backgroundColor: 'transparent',
              color: canResendOTP ? '#dc2626' : '#9ca3af',
              border: 'none',
              fontSize: '14px',
              fontWeight: '500',
              cursor: canResendOTP && !isSendingOTP ? 'pointer' : 'not-allowed',
              textDecoration: canResendOTP ? 'underline' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            {isSendingOTP ? 'Resending...' : canResendOTP ? 'Resend OTP' : `Resend in ${resendCooldown}s`}
          </button>
        </div>
      </div>

      <button
        onClick={handleVerifyOTP}
        disabled={isVerifyingOTP}
        style={{
          width: '100%',
          backgroundColor: '#dc2626',
          color: 'white',
          fontWeight: '600',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          opacity: isVerifyingOTP ? '0.5' : '1',
          cursor: isVerifyingOTP ? 'not-allowed' : 'pointer',
          marginTop: '24px'
        }}
      >
        {isVerifyingOTP ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  )

  const renderStep3 = () => (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          backgroundColor: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
          Email Verified!
        </h2>
        <p style={{ color: '#4b5563' }}>Your email has been successfully verified</p>
      </div>

      <div style={{ backgroundColor: '#f0f9ff', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#0369a1', marginBottom: '8px' }}>
          Registration Summary
        </h3>
        <div style={{ fontSize: '14px', color: '#374151' }}>
          <p><strong>Name:</strong> {formData.fullName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {formData.phone}</p>
          <p><strong>Blood Group:</strong> {formData.bloodGroup}</p>
          <p><strong>Location:</strong> {formData.location}</p>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          width: '100%',
          backgroundColor: '#dc2626',
          color: 'white',
          fontWeight: '600',
          padding: '12px 24px',
          borderRadius: '8px',
          border: 'none',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          opacity: isSubmitting ? '0.5' : '1',
          cursor: isSubmitting ? 'not-allowed' : 'pointer'
        }}
      >
        {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
      </button>
    </div>
  )

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '672px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Join BloodLink
            </h1>
            <p style={{ color: '#4b5563' }}>Create your account to start saving lives</p>
          </div>

          {renderStepIndicator()}

          {/* Message Display */}
          {message && (
            <div style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              backgroundColor: messageType === 'success' ? '#dcfce7' : '#fef2f2',
              border: `1px solid ${messageType === 'success' ? '#bbf7d0' : '#fecaca'}`,
              color: messageType === 'success' ? '#166534' : '#dc2626'
            }}>
              {message}
            </div>
          )}

          {/* Step Content */}
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <p style={{ color: '#4b5563' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '500', transition: 'color 0.2s ease' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
