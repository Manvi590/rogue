import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Eye, 
  Activity, 
  Clock, 
  Calendar, 
  MapPin, 
  Users, 
  Zap, 
  ArrowRight,
  BarChart3
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Events = () => {
  const [activeTab, setActiveTab] = useState("LIVE");

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column" }}>
        
        {/* NAVBAR */}
        <Navbar />

        <div style={{ padding: "60px 5% 60px", flex: 1 }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "60px", maxWidth: "1400px", margin: "0 auto 60px" }}>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.8", marginBottom: "32px" }}>
            <ScrollReveal>LIVE EVENTS</ScrollReveal>
          </h1>
          
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {["LIVE", "UPCOMING", "PAST"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: "10px 24px", 
                  borderRadius: "100px", 
                  background: activeTab === tab ? "#FF6A00" : "rgba(255, 255, 255, 0.05)", 
                  color: activeTab === tab ? "white" : "rgba(255, 255, 255, 0.5)", 
                  border: "none", 
                  fontSize: "11px", 
                  fontWeight: "900", 
                  cursor: "pointer",
                  textTransform: "uppercase",
                  transition: "all 0.2s"
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>



        {/* FEATURED LIVE EVENT */}
        <div style={{ position: "relative", width: "100%", height: "700px", borderRadius: "48px", overflow: "hidden", marginBottom: "80px", boxShadow: "0 50px 100px rgba(0,0,0,0.5)" }}>
          <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1600&q=80" alt="Live Event" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%, rgba(0,0,0,0.4) 100%)" }}></div>
          
          <div style={{ position: "absolute", left: "48px", top: "48px" }}>
            <div style={{ background: "rgba(255, 106, 0, 0.15)", border: "1px solid rgba(255, 106, 0, 0.3)", color: "#FF6A00", padding: "8px 20px", borderRadius: "100px", fontWeight: "900", fontSize: "11px", display: "flex", alignItems: "center", gap: "8px", backdropFilter: "blur(10px)" }}>
              <div style={{ width: "8px", height: "8px", background: "#FF6A00", borderRadius: "50%", animation: "pulse 1s infinite" }}></div> LIVE NOW
            </div>
          </div>

          <div style={{ position: "absolute", right: "48px", top: "48px", textAlign: "right" }}>
             <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "4px" }}>VIEWERS</div>
             <div style={{ fontSize: "24px", fontWeight: "950", color: "white" }}>34,285</div>
          </div>

          <div style={{ position: "absolute", left: "64px", bottom: "64px", right: "64px" }}>
            <div style={{ color: "#FF6A00", fontSize: "12px", fontWeight: "900", letterSpacing: "0.15em", marginBottom: "16px", textTransform: "uppercase" }}>WORLD RECORD ATTEMPT</div>
            <h2 style={{ fontSize: "clamp(48px, 6vw, 84px)", fontWeight: "950", textTransform: "uppercase", lineHeight: "0.9", marginBottom: "32px", letterSpacing: "-0.03em" }}>THE SUMMIT LIFT:<br /> <span style={{ color: "#FF6A00" }}>FINALS</span></h2>
            
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Link to="/stream/summit-lift" style={{ textDecoration: "none" }}>
                <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "20px 48px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 20px 40px rgba(255, 106, 0, 0.3)" }}>
                  WATCH STREAM <Play size={20} fill="white" />
                </button>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: "-10px", marginLeft: "12px" }}>
                 {[1,2,3].map(i => <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid #000", marginLeft: i === 1 ? 0 : -15 }} />)}
                 <span style={{ marginLeft: "12px", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.6)" }}>+12k watching</span>
              </div>
            </div>
          </div>
        </div>

        {/* UPCOMING BATTLES */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px", maxWidth: "1200px", margin: "0 auto 32px" }}>
          <h2 style={{ fontSize: "32px", fontWeight: "950", textTransform: "uppercase" }}>UPCOMING BATTLES</h2>
          <Link to="/schedule" style={{ textDecoration: "none" }}>
            <span style={{ fontSize: "11px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.1em", cursor: "pointer" }}>VIEW SCHEDULE</span>
          </Link>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px", marginBottom: "60px" }}>
          {/* LARGE UPCOMING CARD */}
          <div style={{ position: "relative", borderRadius: "32px", overflow: "hidden", height: "450px" }}>
            <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80" alt="Upcoming" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)" }}></div>
            <div style={{ position: "absolute", left: "32px", bottom: "32px" }}>
               <div style={{ background: "rgba(255,106,0,0.2)", color: "#FF6A00", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", display: "inline-block", marginBottom: "12px" }}>IN 18 HRS</div>
               <h3 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>THE 100M DASH FINAL</h3>
               <div style={{ display: "flex", gap: "24px" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.6)" }}><MapPin size={14} color="#FF6A00" /> OLYMPIC HUB</div>
                 <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.6)" }}><Users size={14} color="#FF6A00" /> 12 ATHLETES</div>
               </div>
            </div>
          </div>

          {/* SIDE CARDS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[
              { title: "STREET WORKOUT FREESTYLE", category: "AGILITY", time: "TOMORROW 10:00 AM", athletes: "24 ATHLETES", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80" },
              { title: "SPEED CLIMBING QUALS", category: "SPEED", time: "SUN, OCT 22 04:00 PM", athletes: "18 ATHLETES", img: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80" }
            ].map((item, idx) => (
              <div key={idx} style={{ position: "relative", borderRadius: "24px", overflow: "hidden", height: "213px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9), transparent)" }} />
                <div style={{ position: "absolute", left: "24px", bottom: "24px" }}>
                  <div style={{ color: "#FF6A00", fontSize: "10px", fontWeight: "900", marginBottom: "8px", textTransform: "uppercase" }}>{item.category}</div>
                  <h4 style={{ fontSize: "20px", fontWeight: "950", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "-0.02em" }}>{item.title}</h4>
                  <div style={{ display: "flex", gap: "16px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>
                    <span>{item.time}</span>
                    <span>•</span>
                    <span>{item.athletes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
          {/* TREND CHART */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "40px", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>EVENT RECORD TREND</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "900", color: "#FF6A00" }}>
                <Activity size={14} /> +12.4% YEARLY GROWTH
              </div>
            </div>
            
            <div style={{ display: "flex", alignItems: "flex-end", gap: "16px", height: "160px", marginBottom: "32px", position: "relative" }}>
               {/* Vertical grid lines */}
               <div style={{ position: "absolute", inset: 0, display: "flex", justifyContent: "space-between", pointerEvents: "none", opacity: 0.1 }}>
                 {[1,2,3,4,5,6].map(i => <div key={i} style={{ width: "1px", height: "100%", background: "white" }} />)}
               </div>
               
               {[30, 45, 35, 55, 40, 95, 65].map((h, idx) => (
                <div key={idx} style={{ flex: 1, position: "relative" }}>
                   <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                    style={{ 
                      background: idx === 5 ? "linear-gradient(to top, #FF6A00, #FF8C3B)" : "rgba(255,255,255,0.05)", 
                      borderRadius: "8px 8px 0 0",
                      width: "100%",
                      boxShadow: idx === 5 ? "0 0 30px rgba(255, 106, 0, 0.4)" : "none"
                    }} 
                   />
                </div>
              ))}
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.2)", fontSize: "10px", fontWeight: "900" }}>
              <span>JAN</span><span>MAR</span><span>MAY</span><span>JUL</span><span style={{ color: "rgba(255,255,255,0.4)" }}>AUG (NOW)</span><span>OCT</span><span>DEC</span>
            </div>
          </div>

          {/* JOIN CARD */}
          <div style={{ 
            background: "linear-gradient(135deg, #FF6A00 0%, #FF8C3B 100%)", 
            borderRadius: "32px", 
            padding: "48px", 
            color: "white", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 30px 60px rgba(255, 106, 0, 0.3)"
          }}>
            <div style={{ position: "absolute", right: "-20px", top: "-20px", opacity: 0.1 }}>
              <Zap size={200} fill="white" />
            </div>
            <h4 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px", lineHeight: "1", position: "relative", zIndex: 2 }}>JOIN THE <br /> CHALLENGE</h4>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", marginBottom: "40px", maxWidth: "320px", position: "relative", zIndex: 2 }}>
              Think you can beat the live record? Prove it on the world stage.
            </p>
            <Link to="/verify" style={{ textDecoration: "none", width: "fit-content", position: "relative", zIndex: 2 }}>
              <button style={{ background: "#000", color: "white", border: "none", borderRadius: "100px", padding: "18px 40px", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                APPLY NOW <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </div>

        <style>{`
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>

    </div>
    <Footer />
    </div>
    </PageTransition>
  );
};

export default Events;
