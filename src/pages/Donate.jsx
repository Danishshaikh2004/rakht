import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { DatabaseService } from '../services/databaseService'

const Donate = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    bloodGroup: '',
    location: '',
    availableDate: '',
    availableTime: '',
    lastDonation: ''
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Update form data when user profile is loaded
  useEffect(() => {
    if (userProfile && currentUser) {
      setFormData({
        name: userProfile.displayName || '',
        email: currentUser.email || '',
        phone: userProfile.phone || '',
        bloodGroup: userProfile.bloodGroup || '',
        location: userProfile.location || '',
        availableDate: '',
        availableTime: '',
        lastDonation: userProfile.lastDonation || ''
      })
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
  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ]

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'

    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits'

    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required'
    if (!formData.location.trim()) newErrors.location = 'Location is required'
    if (!formData.availableDate) newErrors.availableDate = 'Available date is required'
    if (!formData.availableTime) newErrors.availableTime = 'Available time is required'

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
      console.log('Starting donation submission...')
      console.log('Current user:', currentUser)
      console.log('Form data:', formData)

      // Prepare donation data
      const donationData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        availableDate: formData.availableDate,
        availableTime: formData.availableTime,
        lastDonation: formData.lastDonation,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        status: 'pending',
        requestType: 'donation'
      }

      console.log('Donation data to save:', donationData)

      // Update user profile with donation information
      console.log('Updating user profile...')
      const profileResult = await DatabaseService.updateUserProfile(currentUser.uid, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        lastDonation: formData.lastDonation || null
      })

      console.log('Profile update result:', profileResult)

      // Save donation using DatabaseService
      console.log('Saving to donations collection...')
      const donationResult = await DatabaseService.saveDonation(donationData)

      if (donationResult.success) {
        console.log('Donation saved successfully!')
        alert('Thank you for your willingness to donate! We will contact you soon with more details.')

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          bloodGroup: '',
          location: '',
          availableDate: '',
          availableTime: '',
          lastDonation: ''
        })
      } else {
        throw new Error(donationResult.error)
      }
    } catch (error) {
      console.error('Error saving donation:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
      alert(`Error saving donation request: ${error.message}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 pt-16 flex items-center justify-center px-4">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Left Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Donate Blood</h1>
          <p className="text-lg text-gray-700">
            Your donation can save up to three lives. Join our community of heroes and make a difference today.
          </p>

          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Eligibility Check</h3>
                <p className="text-gray-600">We verify your eligibility based on health guidelines and donation history.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Quick Matching</h3>
                <p className="text-gray-600">We match you with nearby hospitals and patients who need your blood type.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Save Lives</h3>
                <p className="text-gray-600">Every donation matters. Be someone's hero and save lives in your community.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Volunteer as a Donor</h2>

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
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your email address"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your phone number"
              />
              {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.bloodGroup ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Select your blood group</option>
                {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
              </select>
              {errors.bloodGroup && <p className="text-red-600 text-sm mt-1">{errors.bloodGroup}</p>}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your city or address"
              />
              {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Date *</label>
                <input
                  type="date"
                  name="availableDate"
                  value={formData.availableDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.availableDate ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.availableDate && <p className="text-red-600 text-sm mt-1">{errors.availableDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available Time *</label>
                <select
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 ${errors.availableTime ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select time</option>
                  {timeSlots.map(time => <option key={time} value={time}>{time}</option>)}
                </select>
                {errors.availableTime && <p className="text-red-600 text-sm mt-1">{errors.availableTime}</p>}
              </div>
            </div>

            {/* Last Donation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Donation Date (if applicable)</label>
              <input
                type="date"
                name="lastDonation"
                value={formData.lastDonation}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-200 border-gray-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'I Want to Donate'}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600 text-sm">
            Need blood instead?{' '}
            <Link to="/request" className="text-red-600 font-medium hover:text-red-700 transition-colors">
              Request Blood
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Donate
