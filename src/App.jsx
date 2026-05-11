import React, { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ReactLenis } from 'lenis/react'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Leaderboard from './pages/Leaderboard'
import About from './pages/About'
import Contact from './pages/Contact'
import Shop from './pages/Shop'
import Explore from './pages/Explore'
import Challenges from './pages/Challenges'
import Verify from './pages/Verify'
import VerificationProcess from './pages/VerificationProcess'
import FAQ from './pages/FAQ'
import Events from './pages/Events'
import Privacy from './pages/Privacy'
import RecordDetail from './pages/RecordDetail'
import StreamDetail from './pages/StreamDetail'
import Schedule from './pages/Schedule'
import Cart from './pages/Cart'
import EliteMembership from './pages/EliteMembership'
import Streams from './pages/Streams'
import Categories from './pages/Categories'
import Profile from './pages/Profile'
import Rules from './pages/Rules'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [loading, setLoading] = useState(true)

  const handleFinish = useCallback(() => {
    setLoading(false)
  }, [])

  return (
    <>
      {loading && <LoadingScreen onFinish={handleFinish} />}
      <ReactLenis root>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/challenge" element={<Challenges />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/process" element={<VerificationProcess />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/events" element={<Events />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/record/:id" element={<RecordDetail />} />
            <Route path="/stream/:id" element={<StreamDetail />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/elite" element={<EliteMembership />} />
            <Route path="/streams" element={<Streams />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/rules" element={<Rules />} />
          </Routes>
        </BrowserRouter>
      </ReactLenis>
    </>
  )
}

export default App
