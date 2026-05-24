import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Eye, Users, MessageSquare, Share2, Shield, Activity, Zap } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

import { apiCall } from "../utils/api";

const CountdownBox = ({ value, label }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ 
      background: "rgba(255,255,255,0.05)", 
      border: "1px solid rgba(255,255,255,0.1)", 
      borderRadius: "12px", 
      padding: "12px", 
      minWidth: "70px", 
      fontSize: "24px", 
      fontWeight: "950", 
      color: "white",
      marginBottom: "8px"
    }}>
      {value}
    </div>
    <div style={{ fontSize: "9px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.1em" }}>{label}</div>
  </div>
);

const eventsData = [
  {
    id: "summit-lift",
    status: "LIVE",
    title: "THE SUMMIT LIFT: FINALS",
    category: "STRENGTH",
    time: "LIVE NOW",
    athletes: "12 ATHLETES",
    viewers: "34,285",
    img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    isFreeStream: false,
    desc: "The pinnacle of raw powerlifting. The world's top heavyweight lifters battle for the absolute bench press record live."
  },
  {
    id: "tetris-showdown",
    status: "LIVE",
    title: "RETRO TETRIS WORLD FINAL",
    category: "GAMING",
    time: "LIVE NOW",
    athletes: "2 PLAYERS",
    viewers: "18,490",
    img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80",
    isFreeStream: true,
    desc: "The final game between two absolute block-stacking legends competing for the maxout 999,999 record."
  },
  {
    id: "dash-final",
    status: "UPCOMING",
    title: "THE 100M DASH FINAL",
    category: "ATHLETICS",
    time: "IN 18 HRS (TOMORROW 02:00 PM)",
    athletes: "12 ATHLETES",
    img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80",
    isFeatured: true,
    desc: "Speed unleashed. A line-up of the fastest sprinters on earth competing for the sub-9.6s record live from Olympic Hub."
  },
  {
    id: "street-workout",
    status: "UPCOMING",
    title: "STREET WORKOUT FREESTYLE",
    category: "AGILITY",
    time: "TOMORROW 10:00 AM",
    athletes: "24 ATHLETES",
    img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "speed-climbing",
    status: "UPCOMING",
    title: "SPEED CLIMBING QUALS",
    category: "SPEED",
    time: "SUN, OCT 22 04:00 PM",
    athletes: "18 ATHLETES",
    img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "water-swim-final",
    status: "PAST",
    title: "50M ICE WATER SWIM CHAMPIONSHIP",
    category: "WATER SPORTS",
    time: "COMPLETED (OCT 15)",
    athletes: "8 SWIMMERS",
    img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    desc: "A freezing duel of raw human endurance. Competitors swim a full 50 meters in near-freezing sub-zero glacial waters."
  },
  {
    id: "reaction-test",
    status: "PAST",
    title: "LIGHT BUTTON HITS CHAMPIONSHIP",
    category: "REACTION",
    time: "COMPLETED (OCT 12)",
    athletes: "10 ATHLETES",
    img: "https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=800&q=80"
  }
];

const StreamDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = React.useState({
    hours: "02",
    minutes: "45",
    seconds: "12"
  });

  // Dynamic ticket spectator passes and stream access
  const [hasTicket, setHasTicket] = React.useState(false);
  const [canWatch, setCanWatch] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [toast, setToast] = React.useState("");
  const [event, setEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [ticketPrice, setTicketPrice] = React.useState(49);
  const [eventIsPaid, setEventIsPaid] = React.useState(false);

  // Fetch event and verify ticket access
  useEffect(() => {
    const fetchEventAndVerifyAccess = async () => {
      setLoading(true);
      try {
        // Get event details
        const eventData = await apiCall(`/events/${id}`, 'GET');
        setEvent(eventData);
        
        // Set event type and price
        if (eventData) {
          setEventIsPaid(eventData.isPaid || false);
          setTicketPrice(eventData.ticketPrice || 49);
          
          // If user is logged in, verify ticket
          if (user) {
            const ticketVerification = await apiCall(`/tickets/verify/${id}`, 'GET', null, user.token);
            setCanWatch(ticketVerification.canWatch);
            setHasTicket(ticketVerification.hasTicket);
          } else {
            // Not logged in - can only watch free events
            setCanWatch(!eventData.isPaid);
            setHasTicket(false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch event details", error);
        // Fallback to demo events
        setCanWatch(true);
        setHasTicket(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndVerifyAccess();
  }, [id, user]);

  const currentEvent = event || eventsData.find(e => e.id === id) || eventsData[0];
  const isLocked = !loading && currentEvent && eventIsPaid && !canWatch;

  const handleWatchClick = () => {
    if (isLocked) {
      setShowModal(true);
      return;
    }
    
    setIsPlaying(prev => !prev);
    if (!isPlaying) {
      showToast(currentEvent.status === "PAST" ? "▶️ Playing completed event playback!" : "🔴 Live HD Stream Loaded Successfully!");
    } else {
      showToast(isPlaying ? "🔴 Stream paused." : "");
    }
  };

  const purchaseTicket = async () => {
    if (!user) {
      showToast("Please log in to purchase a ticket.");
      // Redirect to login
      window.location.href = '/login';
      return;
    }
    try {
      setLoading(true);
      await apiCall('/tickets', 'POST', { eventId: id }, user.token);
      
      // Re-verify ticket access
      const ticketVerification = await apiCall(`/tickets/verify/${id}`, 'GET', null, user.token);
      setCanWatch(ticketVerification.canWatch);
      setHasTicket(ticketVerification.hasTicket);
      
      setShowModal(false);
      setIsPlaying(true);
      showToast("🎟️ Pass Activated! Premium Stream Unlocked.");
    } catch (error) {
      showToast("Ticket purchase failed. Please try again.");
      console.error("Ticket purchase error:", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simple working countdown
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(23, 59, 59); // Example deadline for today
      
      const diff = target - now;
      
      if (diff > 0) {
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        setTimeLeft({
          hours: h.toString().padStart(2, "0"),
          minutes: m.toString().padStart(2, "0"),
          seconds: s.toString().padStart(2, "0")
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif", paddingTop: "120px" }}>
        <Navbar />

        {/* CSS KEYFRAMES */}
        <style>{`
          @keyframes slideIn {
            from { transform: translateY(-20px) scale(0.95); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.4); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

        {/* TOAST ALERT */}
        {toast && (
          <div style={{
            position: "fixed",
            top: "140px",
            right: "5%",
            zIndex: 9999,
            background: "rgba(255, 106, 0, 0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 106, 0, 0.4)",
            padding: "16px 28px",
            borderRadius: "16px",
            color: "white",
            fontSize: "14px",
            fontWeight: "800",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            animation: "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
          }}>
            <div style={{ width: "8px", height: "8px", background: "#FF6A00", borderRadius: "50%", animation: "pulse 1s infinite" }}></div>
            {toast}
          </div>
        )}

        {/* SPECTATOR PASS LOCK MODAL */}
        {showModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0, 0, 0, 0.85)",
            backdropFilter: "blur(15px)",
            animation: "fadeIn 0.25s ease-out"
          }}>
            <div style={{
              background: "linear-gradient(135deg, #161616 0%, #0c0c0c 100%)",
              border: "1px solid rgba(255, 106, 0, 0.25)",
              borderRadius: "32px",
              padding: "48px",
              maxWidth: "520px",
              width: "90%",
              boxShadow: "0 30px 60px rgba(255, 106, 0, 0.15)",
              textAlign: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              {/* Background Glow */}
              <div style={{ position: "absolute", width: "150px", height: "150px", background: "#FF6A00", filter: "blur(100px)", opacity: 0.15, top: "-30px", right: "-30px" }} />

              <div style={{ display: "inline-flex", padding: "16px", background: "rgba(255, 106, 0, 0.1)", borderRadius: "50%", marginBottom: "24px", color: "#FF6A00" }}>
                <Play size={36} fill="#FF6A00" style={{ marginLeft: "4px" }} />
              </div>

              <h3 style={{ fontSize: "28px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "-0.02em" }}>
                SPECTATOR PASS <span style={{ color: "#FF6A00" }}>REQUIRED</span>
              </h3>
              
              <p style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "14px", lineHeight: "1.6", marginBottom: "32px" }}>
                This exclusive live world record attempt requires a Spectator Pass. Secure your premium ticket now to unlock full live coverage, high-definition playbacks, and live chat features!
              </p>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "16px", padding: "20px", marginBottom: "36px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "rgba(255,255,255,0.4)" }}>SINGLE PASS PRICE</span>
                <span style={{ fontSize: "24px", fontWeight: "950", color: "#FF6A00" }}>${ticketPrice.toFixed(2)} USD</span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <button 
                  onClick={purchaseTicket}
                  style={{
                    background: "#FF6A00",
                    color: "white",
                    border: "none",
                    borderRadius: "100px",
                    padding: "18px 36px",
                    fontSize: "13px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(255,106,0,0.2)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "#e55e00";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "#FF6A00";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  ⚡ INSTANT ACCESS PASS
                </button>

                <button 
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "rgba(255, 255, 255, 0.6)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "100px",
                    padding: "16px 36px",
                    fontSize: "13px",
                    fontWeight: "800",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                >
                  CANCEL
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STREAM AREA */}
        <section style={{ padding: "40px 5% 40px", maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gridTemplateRows: "auto auto", gap: "24px" }}>

            {/* VIDEO PLAYER */}
            <div style={{ position: "relative", height: "600px", background: "#000", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
              {isLocked ? (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80"
                    alt="Stream locked"
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px)", opacity: 0.4 }}
                  />
                  <div style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.6)", padding: "20px" }}>
                    <Shield size={56} color="#FF6A00" style={{ marginBottom: "20px", opacity: 0.9 }} />
                    <h3 style={{ fontSize: "22px", fontWeight: "950", marginBottom: "12px", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.05em" }}>THIS LIVESTREAM REQUIRES A VALID EVENT TICKET TO ACCESS</h3>
                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", marginBottom: "32px", textAlign: "center", maxWidth: "480px", lineHeight: "1.6" }}>
                      You need to {user ? "purchase a spectator pass" : "log in and purchase a spectator pass"} to unlock this premium live event.
                    </p>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
                      {!user && (
                        <Link to="/login" style={{ textDecoration: "none" }}>
                          <button style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "14px 32px", borderRadius: "100px", fontWeight: "800", fontSize: "13px", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                            LOGIN
                          </button>
                        </Link>
                      )}
                      <button onClick={() => setShowModal(true)} style={{ background: "#FF6A00", border: "none", color: "white", padding: "14px 32px", borderRadius: "100px", fontWeight: "900", fontSize: "13px", cursor: "pointer", boxShadow: "0 10px 20px rgba(255,106,0,0.25)", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                        PURCHASE TICKET
                      </button>
                      <button style={{ background: "transparent", border: "none", color: "#FF6A00", padding: "14px 32px", borderRadius: "100px", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>
                        REDEEM ACCESS CODE
                      </button>
                    </div>
                  </div>
                </>
              ) : isPlaying ? (
                <div style={{ width: "100%", height: "100%", position: "relative", background: "#0c0c0c" }}>
                  <img
                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80"
                    alt="Stream playing"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "rgba(255, 106, 0, 0.05)", pointerEvents: "none" }} />
                  
                  <div style={{ position: "absolute", bottom: "30px", left: "30px", display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.7)", padding: "10px 20px", borderRadius: "100px", backdropFilter: "blur(10px)" }}>
                    <div style={{ width: "8px", height: "8px", background: "#EF4444", borderRadius: "50%", animation: "pulse 1s infinite" }}></div>
                    <span style={{ fontSize: "12px", fontWeight: "900", color: "white", letterSpacing: "0.05em" }}>LIVE HD FEED</span>
                  </div>

                  <div 
                    style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", opacity: 0, transition: "opacity 0.23s", display: "flex", alignItems: "center", justifyContent: "center" }} 
                    onMouseEnter={e => e.currentTarget.style.opacity = 1} 
                    onMouseLeave={e => e.currentTarget.style.opacity = 0} 
                    onClick={handleWatchClick}
                  >
                    <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><rect x="4" y="4" width="4" height="16" rx="1" /><rect x="16" y="4" width="4" height="16" rx="1" /></svg>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <img
                    src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80"
                    alt="Stream"
                    style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
                  />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={handleWatchClick}>
                    <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 10px 30px rgba(255,106,0,0.3)" }}>
                      <Play fill="white" size={32} />
                    </div>
                  </div>
                </>
              )}

              {/* Overlay Info */}
              <div style={{ position: "absolute", top: "24px", left: "24px", display: "flex", gap: "12px", zIndex: 10 }}>
                <div style={{ background: isPlaying ? "#EF4444" : "#FF6A00", padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "900", display: "flex", alignItems: "center", gap: "8px", transition: "background 0.3s" }}>
                  <div style={{ width: "6px", height: "6px", background: "white", borderRadius: "50%" }}></div> {currentEvent.isFreeStream ? "FREE STREAM" : isPlaying ? "LIVE FEED" : "LIVE"}
                </div>
                <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)", padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "900", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Eye size={14} /> 34.2K VIEWERS
                </div>
              </div>
            </div>

            {/* CHAT SIDE - Matches Video Height */}
            <div style={{ background: "#161616", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", overflow: "hidden", height: "600px" }}>
              <div style={{ padding: "24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: "900", letterSpacing: "0.1em" }}>LIVE CHAT</span>
                <Users size={18} color="rgba(255,255,255,0.3)" />
              </div>

              {/* Messages */}
              <div style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto" }}>
                {[
                  { user: "IronMike", msg: "This is insane! 500kg incoming?" },
                  { user: "RogueMarshal", msg: "Welcome to the finals everyone.", color: "#FF6A00" },
                  { user: "LiftLover", msg: "Thor looks ready today." },
                  { user: "GymRat99", msg: "Let's goooooooo!" },
                  { user: "Sarah_Lift", msg: "The atmosphere in Tokyo is electric." },
                ].map((m, i) => (
                  <div key={i} style={{ fontSize: "13px", lineHeight: "1.5" }}>
                    <span style={{ fontWeight: "900", color: m.color || "rgba(255,255,255,0.4)", marginRight: "8px" }}>{m.user}:</span>
                    <span style={{ fontWeight: "500" }}>{m.msg}</span>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div style={{ padding: "24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    placeholder="Send a message..."
                    style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "100px", padding: "14px 20px", color: "white", fontSize: "13px", outline: "none" }}
                  />
                  <MessageSquare size={16} style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} />
                </div>
              </div>
            </div>

            {/* Title & Info - Below Video */}
            <div style={{ background: "#161616", padding: "32px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                <div>
                  <h1 style={{ fontSize: "32px", fontWeight: "950", textTransform: "uppercase", marginBottom: "8px" }}>{currentEvent.title}</h1>
                  <div style={{ display: "flex", gap: "20px", color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: "700" }}>
                    <span style={{ color: "#FF6A00" }}>#{currentEvent.category}</span>
                    <span>• Tokyo Hub</span>
                    <span>• {currentEvent.athletes}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <button style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "12px 24px", borderRadius: "100px", fontWeight: "800", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Share2 size={16} /> SHARE
                  </button>
                  <button 
                    onClick={handleWatchClick}
                    style={{ 
                      background: isPlaying ? "#EF4444" : "#FF6A00", 
                      border: "none", 
                      color: "white", 
                      padding: "12px 28px", 
                      borderRadius: "100px", 
                      fontWeight: "900", 
                      fontSize: "12px", 
                      cursor: "pointer", 
                      display: "flex", 
                      alignItems: "center", 
                      gap: "8px",
                      boxShadow: isPlaying ? "0 10px 20px rgba(239,68,68,0.2)" : "0 10px 20px rgba(255,106,0,0.2)",
                      transition: "all 0.3s",
                      textTransform: "uppercase"
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                  >
                    {isLocked ? (
                      <>
                        <Shield size={14} fill="white" /> UNLOCK STREAM
                      </>
                    ) : (
                      <>
                        <Play size={14} fill="white" /> {isPlaying ? (currentEvent.status === "PAST" ? "PAUSE PLAYBACK" : "PAUSE FEED") : (currentEvent.status === "PAST" ? "WATCH PLAYBACK" : hasTicket ? "WATCH STREAM" : "WATCH LIVE")}
                      </>
                    )}
                  </button>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.6", fontSize: "15px" }}>
                {currentEvent.desc || "The final stage of the Rogue World Series. Competitors battle live for the absolute title record, officially adjudicated."}
              </p>
            </div>

          </div>
        </section>

        {/* PURCHASE TICKETS SECTION - Conditionally Rendered */}
        {currentEvent.status !== "PAST" && (
          <section style={{ margin: "0 auto 0", padding: "40px 5% 100px", maxWidth: "1400px" }}>
            <div style={{ 
              background: "linear-gradient(135deg, rgba(255,106,0,0.1) 0%, rgba(255,106,0,0.02) 100%)", 
              border: "1px solid rgba(255,106,0,0.2)", 
              borderRadius: "40px", 
              padding: "60px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              position: "relative",
              overflow: "hidden"
            }}>
              <div style={{ position: "absolute", right: "-50px", bottom: "-50px", opacity: 0.05 }}>
                <Shield size={300} color="#FF6A00" />
              </div>

              <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#FF6A00", marginBottom: "20px" }}>
                  <Zap size={20} fill="#FF6A00" />
                  <span style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", textTransform: "uppercase" }}>FRONT-ROW EXPERIENCE</span>
                </div>
                <h2 style={{ fontSize: "56px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: "1", marginBottom: "24px" }}>
                  PURCHASE <br /> <span style={{ color: "#FF6A00" }}>TICKETS NOW</span>
                </h2>
                <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "500px", lineHeight: "1.6", marginBottom: "24px" }}>
                  Want to witness history in person? Secure your exclusive spectator pass now to watch the live world record attempts from the absolute front row.
                </p>
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444", padding: "6px 16px", borderRadius: "100px", fontSize: "11px", fontWeight: "900", letterSpacing: "0.05em" }}>
                    🔥 92% TICKETS SOLD OUT
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "900", color: "white" }}>
                    FROM <span style={{ color: "#FF6A00" }}>$49.00</span> / PASS
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", position: "relative", zIndex: 2 }}>
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>EVENT STARTS IN</div>
                  <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                    <CountdownBox value={timeLeft.hours} label="HOURS" />
                    <CountdownBox value={timeLeft.minutes} label="MINS" />
                    <CountdownBox value={timeLeft.seconds} label="SECS" />
                  </div>
                </div>
                
                <Link to="/shop?category=tickets" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    background: "#FF6A00", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "100px", 
                    padding: "20px 48px", 
                    fontSize: "14px", 
                    fontWeight: "900", 
                    textTransform: "uppercase", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px", 
                    boxShadow: "0 20px 40px rgba(255, 106, 0, 0.3)",
                    transition: "transform 0.3s"
                  }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-5px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                    GET YOUR PASSES <ArrowRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>

    </PageTransition>
  );
};

export default StreamDetail;
