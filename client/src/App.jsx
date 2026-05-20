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
import ProductDetail from './pages/ProductDetail'
import Explore from './pages/Explore'
import Challenges from './pages/Challenges'
import Verify from './pages/Verify'
import ChallengeVerify from './pages/ChallengeVerify'
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
import Appeals from './pages/Appeals'
import SubmitEvidenceLearnMore from './pages/SubmitEvidenceLearnMore'
import GlobalRecognitionLearnMore from './pages/GlobalRecognitionLearnMore'
import ExpertAdjudicationLearnMore from './pages/ExpertAdjudicationLearnMore'
import VerificationProtocolLearnMore from './pages/VerificationProtocolLearnMore'
import Terms from './pages/Terms'
import Cookies from './pages/Cookies'
import GlobalLeaderboard from './pages/GlobalLeaderboard'
import LocalLeaderboards from './pages/LocalLeaderboards'
import GlobalRankings from './pages/GlobalRankings'
import LoadingScreen from './components/LoadingScreen'
import ScrollToTop from './components/ScrollToTop'
import Admin from './pages/Admin'
import SubmissionCheckout from './pages/SubmissionCheckout'
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
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/local-leaderboards" element={<LocalLeaderboards />} />
            <Route path="/global-rankings" element={<GlobalRankings />} />
            <Route path="/global-leaderboard" element={<GlobalLeaderboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/challenge" element={<Challenges />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/challenge-verify" element={<ChallengeVerify />} />
            <Route path="/submission-checkout" element={<SubmissionCheckout />} />
            <Route path="/process" element={<VerificationProcess />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/events" element={<Events />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/record/:id" element={<RecordDetail />} />
            <Route path="/stream/:id" element={<StreamDetail />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/elite" element={<EliteMembership />} />
            <Route path="/streams" element={<Streams />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/submit-evidence-info" element={<SubmitEvidenceLearnMore />} />
            <Route path="/global-recognition-info" element={<GlobalRecognitionLearnMore />} />
            <Route path="/adjudication-info" element={<ExpertAdjudicationLearnMore />} />
            <Route path="/verification-protocol-info" element={<VerificationProtocolLearnMore />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/appeals" element={<Appeals />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
          </Routes>
        </BrowserRouter>
      </ReactLenis>
    </>
  )
}

export default App
