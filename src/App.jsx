import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Donate from './pages/Donate'
import Request from './pages/Request'
import Dashboard from './pages/Dashboard'
import AdminPanel from './pages/AdminPanel'
import AdminAccess from './pages/AdminAccess'
import Contact from './pages/Contact'
import TermsAndConditions from './pages/TermsAndConditions'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Navbar />
        <main className="flex-grow" style={{flexGrow: 1}}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/request" element={<Request />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-access" element={<AdminAccess />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
