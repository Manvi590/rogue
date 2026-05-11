import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Play, Eye, Users, MessageSquare, Share2, Shield, Activity, Zap } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StreamDetail = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* STREAM AREA */}
        <section style={{ padding: "40px 5% 80px", maxWidth: "1600px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", height: "calc(100vh - 200px)", minHeight: "600px" }}>

            {/* VIDEO PLAYER SIDE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ position: "relative", flex: 1, background: "#000", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
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

              {/* Title & Info */}
              <div style={{ background: "#161616", padding: "32px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
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
                    <button style={{ background: "#FF6A00", border: "none", color: "white", padding: "12px 24px", borderRadius: "100px", fontWeight: "800", fontSize: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                      <Zap size={16} fill="white" /> CHALLENGE
                    </button>
                  </div>
                </div>
                <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.6", fontSize: "15px" }}>
                  The final stage of the Rogue World Series. Top athletes from 12 countries compete for the heaviest deadlift in history. Adjudicated by official Rogue Marshals.
                </p>
              </div>
            </div>

            {/* CHAT SIDE */}
            <div style={{ background: "#161616", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
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

          </div>
        </section>

        <div style={{ padding: "120px 0 0" }}>
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
};

export default StreamDetail;
