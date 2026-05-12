import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Play, Eye, Users, MessageSquare, Share2, Shield, Activity, Zap } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

const StreamDetail = () => {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = React.useState({
    hours: "02",
    minutes: "45",
    seconds: "12"
  });

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

        {/* STREAM AREA */}
        <section style={{ padding: "40px 5% 40px", maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gridTemplateRows: "auto auto", gap: "24px" }}>

            {/* VIDEO PLAYER */}
            <div style={{ position: "relative", height: "600px", background: "#000", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
              <img
                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80"
                alt="Stream"
                style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
              />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Play fill="white" size={32} />
                </div>
              </div>

              {/* Overlay Info */}
              <div style={{ position: "absolute", top: "24px", left: "24px", display: "flex", gap: "12px" }}>
                <div style={{ background: "#FF6A00", padding: "6px 16px", borderRadius: "6px", fontSize: "12px", fontWeight: "900", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "6px", height: "6px", background: "white", borderRadius: "50%" }}></div> LIVE
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
                  <h1 style={{ fontSize: "32px", fontWeight: "950", textTransform: "uppercase", marginBottom: "8px" }}>THE SUMMIT LIFT: WORLD FINALS</h1>
                  <div style={{ display: "flex", gap: "20px", color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: "700" }}>
                    <span style={{ color: "#FF6A00" }}>#Strength</span>
                    <span>• Tokyo Hub</span>
                    <span>• 12 Athletes</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "12px" }}>
                  <button style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "12px 24px", borderRadius: "100px", fontWeight: "800", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Share2 size={16} /> SHARE
                  </button>
                  <Link to="/challenge-verify" style={{ textDecoration: "none" }}>
                    <button style={{ background: "#FF6A00", border: "none", color: "white", padding: "12px 24px", borderRadius: "100px", fontWeight: "800", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Zap size={16} fill="white" /> CHALLENGE
                    </button>
                  </Link>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.6", fontSize: "15px" }}>
                The final stage of the Rogue World Series. Top athletes from 12 countries compete for the heaviest deadlift in history. Adjudicated by official Rogue Marshals.
              </p>
            </div>

          </div>
        </section>

        {/* READY TO CHALLENGE SECTION */}
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
                <span style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", textTransform: "uppercase" }}>READY TO MAKE HISTORY?</span>
              </div>
              <h2 style={{ fontSize: "56px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: "1", marginBottom: "24px" }}>
                CHALLENGE THIS <br /> <span style={{ color: "#FF6A00" }}>RECORD NOW</span>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "500px", lineHeight: "1.6" }}>
                Think you have what it takes to break this record live? Fill out the submission form before the deadline to be officially adjudicated.
              </p>
            </div>

            <div style={{ textAlign: "right", position: "relative", zIndex: 2 }}>
              <div style={{ marginBottom: "32px" }}>
                <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>SUBMISSION DEADLINE</div>
                <div style={{ display: "flex", gap: "16px", justifyContent: "flex-end" }}>
                  <CountdownBox value={timeLeft.hours} label="HOURS" />
                  <CountdownBox value={timeLeft.minutes} label="MINS" />
                  <CountdownBox value={timeLeft.seconds} label="SECS" />
                </div>
              </div>
              
              <Link to="/challenge-verify" style={{ textDecoration: "none" }}>
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
                  OPEN SUBMISSION FORM <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

    </PageTransition>
  );
};

export default StreamDetail;
