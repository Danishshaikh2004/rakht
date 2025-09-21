import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { DatabaseService } from '../services/databaseService'

const Request = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    bloodGroup: '',
    urgency: '',
    prescriptionDetails: '',
    hospitalLocation: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when user profile is loaded
  useEffect(() => {
    if (userProfile && currentUser) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.displayName || '',
        contact: currentUser.email || userProfile.phone || ''
      }))
    }
  }, [userProfile, currentUser])

  // Redirect if not logged in
  useEffect(() => {
    if (currentUser === null) {
      navigate('/login')
    }
  }, [currentUser, navigate])

  // Don't render if not logged in
  if (!currentUser) {
    return null
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const urgencyLevels = [
    { value: 'immediate', label: 'Immediate', color: 'text-red-600' },
    { value: '1hour', label: 'Within 1 hour', color: 'text-red-500' },
    { value: 'today', label: 'Today', color: 'text-orange-500' },
    { value: 'tomorrow', label: 'Tomorrow', color: 'text-yellow-500' }
  ]

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.contact.trim()) newErrors.contact = 'Contact info is required'
    else if (!/^\d{10}$/.test(formData.contact) && !/\S+@\S+\.\S+/.test(formData.contact))
      newErrors.contact = 'Enter valid phone or email'
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required'
    if (!formData.urgency) newErrors.urgency = 'Urgency level is required'
    if (!formData.prescriptionDetails.trim()) newErrors.prescriptionDetails = 'Prescription details are required'
    if (!formData.hospitalLocation.trim()) newErrors.hospitalLocation = 'Hospital location is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      console.log('Starting blood request submission...')
      console.log('Current user:', currentUser)
      console.log('Form data:', formData)

      // Prepare request data
      const requestData = {
        name: formData.name,
        contact: formData.contact,
        bloodGroup: formData.bloodGroup,
        urgency: formData.urgency,
        prescriptionDetails: formData.prescriptionDetails,
        hospitalLocation: formData.hospitalLocation,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'pending',
        requestType: 'blood_request'
      }

      console.log('Request data to save:', requestData)

      // Save blood request using DatabaseService (no files to upload)
      console.log('Saving to blood_requests collection...')
      const result = await DatabaseService.saveBloodRequest(requestData, {})

      if (result.success) {
        // Update user profile with request information
        console.log('Updating user profile...')
        await DatabaseService.updateUserProfileWithRequest(currentUser.uid, requestData)

        console.log('Blood request saved successfully!')
        alert('Your blood request has been submitted! Donor matches will contact you soon.')

        // Reset form
        setFormData({
          name: '',
          contact: '',
          bloodGroup: '',
          urgency: '',
          prescriptionDetails: ''
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Error saving blood request:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
      alert(`Error saving blood request: ${error.message}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 pt-16 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Request Blood</h1>
          <p className="text-lg text-gray-700">
            Need blood urgently? Submit your request and we'll connect you with nearby donors immediately.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Urgent Response</h3>
                <p className="text-gray-600">Emergency requests are prioritized and matched quickly.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Location Matching</h3>
                <p className="text-gray-600">We find donors in your area for faster response.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Verified Process</h3>
                <p className="text-gray-600">All requests are verified and matched with compatible donors.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Blood Request</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter patient's full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact (Phone/Email) *</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter phone number or email"
              />
              {errors.contact && <p className="text-red-600 text-sm mt-1">{errors.contact}</p>}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select required blood group</option>
                {bloodGroups.map(group => <option key={group} value={group}>{group}</option>)}
              </select>
              {errors.bloodGroup && <p className="text-red-600 text-sm mt-1">{errors.bloodGroup}</p>}
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level *</label>
              <div className="space-y-2">
                {urgencyLevels.map(level => (
                  <label key={level.value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="urgency"
                      value={level.value}
                      checked={formData.urgency === level.value}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-200"
                    />
                    <span className={`font-medium ${level.color}`}>{level.label}</span>
                  </label>
                ))}
              </div>
              {errors.urgency && <p className="text-red-600 text-sm mt-1">{errors.urgency}</p>}
            </div>

          {/* Prescription Details */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prescription Details *</label>
            <textarea
              name="prescriptionDetails"
              value={formData.prescriptionDetails}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.prescriptionDetails ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Please provide details about the prescription, blood type required, medical condition, doctor's recommendation, etc."
            />
            {errors.prescriptionDetails && <p className="text-red-600 text-sm mt-1">{errors.prescriptionDetails}</p>}
          </div>

          {/* Hospital Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Location *</label>
            <input
              type="text"
              name="hospitalLocation"
              value={formData.hospitalLocation}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.hospitalLocation ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter hospital location"
            />
            {errors.hospitalLocation && <p className="text-red-600 text-sm mt-1">{errors.hospitalLocation}</p>}
          </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Request Blood'}
            </button>
          </form>

          <p className="mt-5 text-center text-gray-600 text-sm">
            Want to donate instead?{' '}
            <Link to="/donate" className="text-red-600 font-medium hover:text-red-700">Become a Donor</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Request
