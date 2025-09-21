import { Link } from 'react-router-dom'

const TermsAndConditions = () => {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 16px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: '700', color: '#111827', marginBottom: '8px' }}>
              Terms and Conditions
            </h1>
            <p style={{ color: '#4b5563' }}>Please read these terms carefully before using BloodLink</p>
          </div>

          <div style={{ lineHeight: '1.7', color: '#374151' }}>
            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                1. Information Accuracy
              </h2>
              <p style={{ marginBottom: '16px' }}>
                By registering with BloodLink, you agree to provide accurate, genuine, and truthful information about yourself. This includes but is not limited to:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                <li>Your full name and contact information</li>
                <li>Your blood group and medical details</li>
                <li>Your location and availability status</li>
                <li>Your donation history and medical records</li>
              </ul>
              <div style={{
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <strong style={{ color: '#92400e' }}>
                  ⚠️ Important: All information provided must be genuine and accurate. Providing false or misleading information is strictly prohibited.
                </strong>
              </div>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                2. Prohibited Activities
              </h2>
              <p style={{ marginBottom: '16px' }}>
                You agree not to misuse this website or engage in any of the following activities:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                <li>Providing false or fraudulent information</li>
                <li>Using the platform for any illegal purposes</li>
                <li>Harassment or abuse of other users</li>
                <li>Sharing inappropriate or offensive content</li>
                <li>Attempting to compromise the security of the platform</li>
                <li>Using automated tools to access or manipulate the service</li>
                <li>Impersonating others or providing false identity information</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                3. Legal Consequences
              </h2>
              <div style={{
                backgroundColor: '#fee2e2',
                border: '1px solid #dc2626',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <p style={{ margin: '0', color: '#dc2626', fontWeight: '600' }}>
                  🚨 <strong>Legal Notice:</strong> Any misuse of this website or provision of false information will result in immediate account suspension and may lead to legal action.
                </p>
              </div>
              <p style={{ marginBottom: '16px' }}>
                Violations of these terms may result in:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                <li>Immediate termination of your account</li>
                <li>Reporting to relevant authorities</li>
                <li>Civil or criminal legal proceedings</li>
                <li>Permanent ban from using the platform</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                4. Platform Usage
              </h2>
              <p style={{ marginBottom: '16px' }}>
                By using BloodLink, you agree to:
              </p>
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                <li>Use the platform only for legitimate blood donation purposes</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Keep your account information secure and confidential</li>
                <li>Notify us immediately of any security breaches or unauthorized access</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                5. Limitation of Liability
              </h2>
              <p style={{ marginBottom: '16px' }}>
                BloodLink is a platform connecting donors and recipients. We strive to verify information but cannot guarantee the accuracy of all user-provided data. Users are responsible for verifying information before any blood donation activities.
              </p>
            </section>

            <section style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '16px' }}>
                6. Contact Information
              </h2>
              <p style={{ marginBottom: '16px' }}>
                If you have any questions about these Terms and Conditions, please contact us through our{' '}
                <Link to="/contact" style={{ color: '#dc2626', textDecoration: 'none', fontWeight: '500' }}>
                  contact page
                </Link>
                .
              </p>
            </section>

            <div style={{
              backgroundColor: '#f0f9ff',
              border: '1px solid #0ea5e9',
              borderRadius: '8px',
              padding: '16px',
              marginTop: '32px'
            }}>
              <p style={{ margin: '0', color: '#0369a1', fontWeight: '600' }}>
                📅 <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link
              to="/register"
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'all 0.2s ease',
                display: 'inline-block'
              }}
            >
              Back to Registration
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
