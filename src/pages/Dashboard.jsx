import { useState } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('requests')
  const [filterBloodGroup, setFilterBloodGroup] = useState('')
  const [filterUrgency, setFilterUrgency] = useState('')

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  const urgencyLevels = ['All', 'Immediate', '1 hour', 'Today', 'Tomorrow']

  const recentRequests = [
    {
      id: 1,
      name: 'John Smith',
      bloodGroup: 'A+',
      location: 'Downtown Hospital',
      urgency: 'immediate',
      distance: '2.3 km',
      timeAgo: '5 mins ago',
      contact: '+1-555-0123'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      bloodGroup: 'O-',
      location: 'City Medical Center',
      urgency: 'today',
      distance: '4.1 km',
      timeAgo: '15 mins ago',
      contact: '+1-555-0456'
    },
    {
      id: 3,
      name: 'Michael Chen',
      bloodGroup: 'B+',
      location: 'Regional Hospital',
      urgency: 'tomorrow',
      distance: '1.8 km',
      timeAgo: '1 hour ago',
      contact: '+1-555-0789'
    }
  ]

  const nearbyDonors = [
    {
      id: 1,
      name: 'David Wilson',
      bloodGroup: 'A+',
      location: 'Downtown',
      lastDonation: '2024-01-15',
      distance: '1.2 km',
      contact: '+1-555-0321'
    },
    {
      id: 2,
      name: 'Emily Davis',
      bloodGroup: 'O-',
      location: 'Midtown',
      lastDonation: '2024-02-20',
      distance: '2.5 km',
      contact: '+1-555-0654'
    },
    {
      id: 3,
      name: 'Robert Brown',
      bloodGroup: 'B+',
      location: 'Uptown',
      lastDonation: '2024-01-30',
      distance: '3.1 km',
      contact: '+1-555-0987'
    }
  ]

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'immediate': return 'bg-red-100 text-red-800 border-red-200'
      case '1hour': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'today': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'tomorrow': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredRequests = recentRequests.filter(request => {
    if (filterBloodGroup && request.bloodGroup !== filterBloodGroup) return false
    if (filterUrgency && filterUrgency !== 'All' && request.urgency !== filterUrgency.toLowerCase().replace(' ', '')) return false
    return true
  })

  const filteredDonors = nearbyDonors.filter(donor => {
    if (filterBloodGroup && donor.bloodGroup !== filterBloodGroup) return false
    return true
  })

  return (
    <div className="pt-16 min-h-screen bg-gray-50" style={{paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f9fafb'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" style={{maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px', paddingTop: '32px', paddingBottom: '32px'}}>
        {/* Header */}
        <div className="mb-8" style={{marginBottom: '32px'}}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{fontSize: '30px', fontWeight: '700', color: '#111827', marginBottom: '8px'}}>Dashboard</h1>
          <p className="text-gray-600" style={{color: '#4b5563'}}>Manage your blood donation and request activities</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8" style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '24px', marginBottom: '32px'}}>
          <Link to="/request" className="card hover:shadow-lg transition-shadow cursor-pointer" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px', transition: 'box-shadow 0.2s ease', cursor: 'pointer'}}>
            <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-4" style={{width: '48px', height: '48px', backgroundColor: '#dc2626', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '24px', height: '24px', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827'}}>Request Blood</h3>
                <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Need blood urgently?</p>
              </div>
            </div>
          </Link>

          <Link to="/donate" className="card hover:shadow-lg transition-shadow cursor-pointer" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px', transition: 'box-shadow 0.2s ease', cursor: 'pointer'}}>
            <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4" style={{width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '24px', height: '24px', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827'}}>Donate Blood</h3>
                <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Save lives today</p>
              </div>
            </div>
          </Link>

          <div className="card" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px'}}>
            <div className="flex items-center" style={{display: 'flex', alignItems: 'center'}}>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4" style={{width: '48px', height: '48px', backgroundColor: '#10b981', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px'}}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '24px', height: '24px', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827'}}>Your Status</h3>
                <p className="text-sm text-gray-600" style={{fontSize: '14px', color: '#4b5563'}}>Verified Donor</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6" style={{marginBottom: '24px'}}>
          <div className="border-b border-gray-200" style={{borderBottom: '1px solid #e5e7eb'}}>
            <nav className="-mb-px flex space-x-8" style={{marginBottom: '-1px', display: 'flex', gap: '32px'}}>
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'requests' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                style={{paddingTop: '8px', paddingBottom: '8px', paddingLeft: '4px', paddingRight: '4px', borderBottom: activeTab === 'requests' ? '2px solid #dc2626' : '2px solid transparent', fontWeight: '500', fontSize: '14px', color: activeTab === 'requests' ? '#dc2626' : '#6b7280', borderColor: activeTab === 'requests' ? '#dc2626' : 'transparent'}}
              >
                Recent Requests
              </button>
              <button
                onClick={() => setActiveTab('donors')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'donors' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                style={{paddingTop: '8px', paddingBottom: '8px', paddingLeft: '4px', paddingRight: '4px', borderBottom: activeTab === 'donors' ? '2px solid #dc2626' : '2px solid transparent', fontWeight: '500', fontSize: '14px', color: activeTab === 'donors' ? '#dc2626' : '#6b7280', borderColor: activeTab === 'donors' ? '#dc2626' : 'transparent'}}
              >
                Donors Near Me
              </button>
            </nav>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4" style={{marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '16px'}}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Blood Group</label>
            <select
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
              className="input-field w-40"
              style={{width: '160px', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', transition: 'all 0.2s ease'}}
            >
              <option value="">All Groups</option>
              {bloodGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          {activeTab === 'requests' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>Urgency</label>
              <select
                value={filterUrgency}
                onChange={(e) => setFilterUrgency(e.target.value)}
                className="input-field w-40"
                style={{width: '160px', padding: '12px 16px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', transition: 'all 0.2s ease'}}
              >
                {urgencyLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end" style={{display: 'flex', alignItems: 'flex-end'}}>
            <button
              onClick={() => {
                setFilterBloodGroup('')
                setFilterUrgency('')
              }}
              className="btn-secondary"
              style={{backgroundColor: '#f3f4f6', color: '#374151', fontWeight: '500', padding: '12px 24px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', transition: 'all 0.2s ease'}}
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'requests' ? (
          <div className="grid gap-6" style={{display: 'grid', gap: '24px'}}>
            {filteredRequests.map((request) => (
              <div key={request.id} className="card" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px'}}>
                <div className="flex justify-between items-start mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" style={{fontSize: '18px', fontWeight: '600', color: '#111827'}}>{request.name}</h3>
                    <p className="text-gray-600" style={{color: '#4b5563'}}>{request.location}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(request.urgency)}`} style={{padding: '4px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', border: '1px solid'}}>
                    {request.urgency === 'immediate' ? 'Immediate' :
                     request.urgency === '1hour' ? 'Within 1 hour' :
                     request.urgency === 'today' ? 'Today' : 'Tomorrow'}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm" style={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '16px', fontSize: '14px'}}>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Blood Group:</span>
                    <span className="ml-2 text-red-600 font-semibold" style={{marginLeft: '8px', color: '#dc2626', fontWeight: '600'}}>{request.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Distance:</span>
                    <span className="ml-2" style={{marginLeft: '8px'}}>{request.distance}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Contact:</span>
                    <span className="ml-2" style={{marginLeft: '8px'}}>{request.contact}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Posted:</span>
                    <span className="ml-2" style={{marginLeft: '8px'}}>{request.timeAgo}</span>
                  </div>
                </div>

                <div className="flex space-x-3" style={{display: 'flex', gap: '12px'}}>
                  <button className="btn-primary flex-1" style={{backgroundColor: '#dc2626', color: 'white', fontWeight: '600', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', flex: 1}}>
                    I Can Donate
                  </button>
                  <button className="btn-secondary" style={{backgroundColor: '#f3f4f6', color: '#374151', fontWeight: '500', padding: '12px 24px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', transition: 'all 0.2s ease'}}>
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-6" style={{display: 'grid', gap: '24px'}}>
            {filteredDonors.map((donor) => (
              <div key={donor.id} className="card" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px'}}>
                <div className="flex justify-between items-start mb-4" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px'}}>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900" style={{fontSize: '18px', fontWeight: '600', color: '#111827'}}>{donor.name}</h3>
                    <p className="text-gray-600" style={{color: '#4b5563'}}>{donor.location}</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium border border-green-200" style={{padding: '4px 12px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '9999px', fontSize: '12px', fontWeight: '500', border: '1px solid #bbf7d0'}}>
                    Available
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm" style={{display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px', marginBottom: '16px', fontSize: '14px'}}>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Blood Group:</span>
                    <span className="ml-2 text-red-600 font-semibold" style={{marginLeft: '8px', color: '#dc2626', fontWeight: '600'}}>{donor.bloodGroup}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Distance:</span>
                    <span className="ml-2" style={{marginLeft: '8px'}}>{donor.distance}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Last Donation:</span>
                    <span className="ml-2" style={{marginLeft: '8px'}}>{new Date(donor.lastDonation).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700" style={{fontWeight: '500', color: '#374151'}}>Contact:</span>
                    <span className="ml-2" style={{marginLeft: '8px'}}>{donor.contact}</span>
                  </div>
                </div>

                <div className="flex space-x-3" style={{display: 'flex', gap: '12px'}}>
                  <button className="btn-primary flex-1" style={{backgroundColor: '#dc2626', color: 'white', fontWeight: '600', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', flex: 1}}>
                    Request Blood
                  </button>
                  <button className="btn-secondary" style={{backgroundColor: '#f3f4f6', color: '#374151', fontWeight: '500', padding: '12px 24px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', transition: 'all 0.2s ease'}}>
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Map Toggle */}
        <div className="mt-8 text-center" style={{marginTop: '32px', textAlign: 'center'}}>
          <button className="btn-secondary" style={{backgroundColor: '#f3f4f6', color: '#374151', fontWeight: '500', padding: '12px 24px', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer', transition: 'all 0.2s ease'}}>
            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '20px', height: '20px', marginRight: '8px', display: 'inline'}}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            View on Map
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
