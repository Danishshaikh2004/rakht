import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { currentUser } = useAuth()

  const stats = [
    { number: '10,000+', label: 'Lives Saved', icon: '❤️' },
    { number: '5,000+', label: 'Active Donors', icon: '🩸' },
    { number: '500+', label: 'Hospitals', icon: '🏥' },
    { number: '24/7', label: 'Support', icon: '📞' }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Blood Recipient',
      content: 'BloodLink saved my life during emergency surgery. The donor matching was incredibly fast.',
      rating: 5
    },
    {
      name: 'Dr. Michael Chen',
      role: 'Hospital Director',
      content: 'The platform has revolutionized how we manage blood donations. Highly recommended.',
      rating: 5
    },
    {
      name: 'Robert Davis',
      role: 'Regular Donor',
      content: 'Easy to use platform that makes donating blood a rewarding experience.',
      rating: 5
    }
  ]

  return (
    <div className="pt-16" style={{paddingTop: '64px'}}>
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex items-center" style={{background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 50%, #eff6ff 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" style={{maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px', paddingTop: '80px', paddingBottom: '80px'}}>
          <div className="text-center" style={{textAlign: 'center'}}>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6" style={{fontSize: '48px', fontWeight: '700', color: '#111827', marginBottom: '24px'}}>
              Connecting Lives
              <span className="block text-red-600" style={{display: 'block', color: '#dc2626'}}>Through Blood</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto" style={{fontSize: '20px', color: '#4b5563', marginBottom: '32px', maxWidth: '768px', marginLeft: 'auto', marginRight: 'auto'}}>
              {currentUser
                ? 'Welcome back! Ready to make a difference in someone\'s life today?'
                : 'Join our community of heroes. Every drop of blood you donate can save up to three lives. Make a difference today.'
              }
            </p>

            {currentUser ? (
              // Logged in user content
              <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center'}}>
                <Link to="/donate" className="btn-primary text-lg px-8 py-4" style={{backgroundColor: '#dc2626', color: 'white', fontWeight: '600', padding: '16px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textDecoration: 'none', fontSize: '18px'}}>
                  Donate Blood
                </Link>
                <Link to="/request" className="btn-secondary text-lg px-8 py-4" style={{backgroundColor: '#2563eb', color: 'white', fontWeight: '600', padding: '16px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textDecoration: 'none', fontSize: '18px'}}>
                  Request Blood
                </Link>
              </div>
            ) : (
              // Not logged in user content
              <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center'}}>
                <Link to="/register" className="btn-primary text-lg px-8 py-4" style={{backgroundColor: '#dc2626', color: 'white', fontWeight: '600', padding: '16px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textDecoration: 'none', fontSize: '18px'}}>
                  Join Now
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4" style={{backgroundColor: '#2563eb', color: 'white', fontWeight: '600', padding: '16px 32px', borderRadius: '8px', border: 'none', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textDecoration: 'none', fontSize: '18px'}}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white" style={{paddingTop: '80px', paddingBottom: '80px', backgroundColor: 'white'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px'}}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8" style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '32px'}}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center" style={{textAlign: 'center'}}>
                <div className="text-4xl mb-2" style={{fontSize: '36px', marginBottom: '8px'}}>{stat.icon}</div>
                <div className="text-3xl font-bold text-red-600 mb-2" style={{fontSize: '30px', fontWeight: '700', color: '#dc2626', marginBottom: '8px'}}>{stat.number}</div>
                <div className="text-gray-600" style={{color: '#4b5563'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50" style={{paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#f9fafb'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px'}}>
          <div className="text-center mb-16" style={{textAlign: 'center', marginBottom: '64px'}}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{fontSize: '36px', fontWeight: '700', color: '#111827', marginBottom: '16px'}}>Why Choose BloodLink?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{fontSize: '20px', color: '#4b5563', maxWidth: '672px', marginLeft: 'auto', marginRight: 'auto'}}>
              We're committed to making blood donation safe, easy, and accessible for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '32px'}}>
            <div className="card text-center" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px', textAlign: 'center'}}>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '64px', height: '64px', backgroundColor: '#dc2626', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: '24px'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '32px', height: '32px', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Verified Donors</h3>
              <p className="text-gray-600" style={{color: '#4b5563'}}>All donors are thoroughly verified and health-checked before donation.</p>
            </div>

            <div className="card text-center" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px', textAlign: 'center'}}>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: '24px'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '32px', height: '32px', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Quick Response</h3>
              <p className="text-gray-600" style={{color: '#4b5563'}}>Emergency requests are matched with nearby donors within minutes.</p>
            </div>

            <div className="card text-center" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px', textAlign: 'center'}}>
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6" style={{width: '64px', height: '64px', backgroundColor: '#dc2626', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', marginBottom: '24px'}}>
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{width: '32px', height: '32px', color: 'white'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{fontSize: '20px', fontWeight: '600', marginBottom: '16px'}}>Save Lives</h3>
              <p className="text-gray-600" style={{color: '#4b5563'}}>Your donation can save up to three lives. Be someone's hero today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white" style={{paddingTop: '80px', paddingBottom: '80px', backgroundColor: 'white'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{maxWidth: '1280px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px'}}>
          <div className="text-center mb-16" style={{textAlign: 'center', marginBottom: '64px'}}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4" style={{fontSize: '36px', fontWeight: '700', color: '#111827', marginBottom: '16px'}}>What People Say</h2>
            <p className="text-xl text-gray-600" style={{fontSize: '20px', color: '#4b5563'}}>Stories from our community of donors and recipients.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '32px'}}>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card" style={{backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '24px'}}>
                <div className="flex mb-4" style={{display: 'flex', marginBottom: '16px'}}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" style={{width: '20px', height: '20px', color: '#fbbf24'}}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic" style={{color: '#4b5563', marginBottom: '24px', fontStyle: 'italic'}}>"{testimonial.content}"</p>
                <div>
                  <h4 className="font-semibold text-gray-900" style={{fontWeight: '600', color: '#111827'}}>{testimonial.name}</h4>
                  <p className="text-red-600 text-sm" style={{color: '#dc2626', fontSize: '14px'}}>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-red-600 text-white" style={{paddingTop: '80px', paddingBottom: '80px', backgroundColor: '#dc2626', color: 'white'}}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" style={{maxWidth: '896px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '16px', paddingRight: '16px', textAlign: 'center'}}>
          <h2 className="text-4xl font-bold mb-6" style={{fontSize: '36px', fontWeight: '700', marginBottom: '24px'}}>Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90" style={{fontSize: '20px', marginBottom: '32px', opacity: '0.9'}}>
            Join thousands of donors who are saving lives every day. Your donation matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center'}}>
            <Link to="/register" className="bg-white text-red-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-colors" style={{backgroundColor: 'white', color: '#dc2626', fontWeight: '600', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', transition: 'background-color 0.2s ease'}}>
              Get Started Today
            </Link>
            <Link to="/contact" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-red-600 transition-colors" style={{border: '2px solid white', color: 'white', fontWeight: '600', padding: '12px 32px', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s ease'}}>
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
