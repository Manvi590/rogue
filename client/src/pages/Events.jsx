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

const Events = () => {
  const [activeTab, setActiveTab] = useState("LIVE");
  const filteredEvents = eventsData.filter(event => event.status === activeTab);
  const featuredEvent = filteredEvents.find(e => e.isFeatured) || filteredEvents[0];
  const otherEvents = filteredEvents.filter(e => e.id !== (featuredEvent?.id || ""));

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingTop: "120px", display: "flex", flexDirection: "column" }}>
        
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

        {/* DYNAMIC EVENTS CONTENT SECTION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
            style={{ maxWidth: "1200px", margin: "0 auto 60px", width: "100%" }}
          >
            {/* FEATURED EVENT */}
            {featuredEvent && (
              <div style={{ position: "relative", width: "100%", height: "550px", borderRadius: "32px", overflow: "hidden", marginBottom: "60px", boxShadow: "0 40px 80px rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <img src={featuredEvent.img} alt={featuredEvent.title} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.65)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95) 0%, transparent 60%)" }}></div>
                
                {/* Status Badge */}
                <div style={{ position: "absolute", left: "32px", top: "32px" }}>
                  <div style={{ 
                    background: featuredEvent.status === "LIVE" ? "rgba(255, 106, 0, 0.15)" : "rgba(255, 255, 255, 0.08)", 
                    border: featuredEvent.status === "LIVE" ? "1px solid rgba(255, 106, 0, 0.3)" : "1px solid rgba(255, 255, 255, 0.15)", 
                    color: featuredEvent.status === "LIVE" ? "#FF6A00" : "white", 
                    padding: "8px 20px", 
                    borderRadius: "100px", 
                    fontWeight: "900", 
                    fontSize: "11px", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "8px", 
                    backdropFilter: "blur(10px)",
                    textTransform: "uppercase"
                  }}>
                    {featuredEvent.status === "LIVE" && (
                      <div style={{ width: "8px", height: "8px", background: "#FF6A00", borderRadius: "50%", animation: "pulse 1s infinite" }}></div>
                    )}
                    {featuredEvent.status === "LIVE" ? "LIVE NOW" : `${featuredEvent.status} EVENT`}
                  </div>
                </div>

                {/* Top Right stats */}
                <div style={{ position: "absolute", right: "32px", top: "32px", textAlign: "right" }}>
                  {featuredEvent.status === "LIVE" ? (
                    <>
                      <div style={{ fontSize: "9px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.1em" }}>VIEWERS</div>
                      <div style={{ fontSize: "20px", fontWeight: "950", color: "white" }}>{featuredEvent.viewers || "10K+"}</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: "9px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.1em" }}>WHEN</div>
                      <div style={{ fontSize: "14px", fontWeight: "900", color: "white" }}>{featuredEvent.time}</div>
                    </>
                  )}
                </div>

                {/* Content bottom */}
                <div style={{ position: "absolute", left: "48px", bottom: "48px", right: "48px" }}>
                  <div style={{ color: "#FF6A00", fontSize: "11px", fontWeight: "900", letterSpacing: "0.15em", marginBottom: "12px", textTransform: "uppercase" }}>
                    {featuredEvent.category} • {featuredEvent.athletes}
                  </div>
                  <h2 style={{ fontSize: "clamp(32px, 4vw, 56px)", fontWeight: "950", textTransform: "uppercase", lineHeight: "1.0", marginBottom: "20px", letterSpacing: "-0.03em" }}>
                    {featuredEvent.title}
                  </h2>
                  {featuredEvent.desc && (
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: "1.6", maxWidth: "600px", marginBottom: "24px" }}>
                      {featuredEvent.desc}
                    </p>
                  )}
                  
                  {featuredEvent.status === "LIVE" ? (
                    <Link to={`/stream/${featuredEvent.id}`} style={{ textDecoration: "none" }}>
                      <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "16px 36px", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 20px 40px rgba(255, 106, 0, 0.3)", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                        WATCH STREAM <Play size={16} fill="white" />
                      </button>
                    </Link>
                  ) : featuredEvent.status === "UPCOMING" ? (
                    <Link to="/schedule" style={{ textDecoration: "none" }}>
                      <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "16px 36px", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 20px 40px rgba(255, 106, 0, 0.3)" }}>
                        VIEW SCHEDULE <ArrowRight size={16} />
                      </button>
                    </Link>
                  ) : (
                    <button style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "none", borderRadius: "100px", padding: "16px 36px", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "10px" }}>
                      EVENT COMPLETED
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* OTHERS LIST / GRID */}
            {otherEvents.length > 0 ? (
              <div>
                <h3 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase", marginBottom: "28px", letterSpacing: "-0.02em" }}>
                  MORE {activeTab} BATTLES
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
                  {otherEvents.map((item) => (
                    <div key={item.id} style={{ position: "relative", borderRadius: "24px", overflow: "hidden", height: "240px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <img src={item.img} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4 }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.95), transparent 70%)" }} />
                      <div style={{ position: "absolute", left: "24px", bottom: "24px", right: "24px" }}>
                        <div style={{ color: "#FF6A00", fontSize: "10px", fontWeight: "900", marginBottom: "8px", textTransform: "uppercase" }}>
                          {item.category}
                        </div>
                        <h4 style={{ fontSize: "20px", fontWeight: "950", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.title}
                        </h4>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                          <div style={{ display: "flex", gap: "12px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>
                            <span>{item.time}</span>
                            <span>•</span>
                            <span>{item.athletes}</span>
                          </div>
                          {item.status === "LIVE" && (
                            <Link to={`/stream/${item.id}`} style={{ textDecoration: "none" }}>
                              <button style={{ background: "#FF6A00", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
                                <Play size={14} fill="white" style={{ marginLeft: "2px" }} />
                              </button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : !featuredEvent ? (
              <div style={{ textAlign: "center", padding: "80px 0", color: "rgba(255,255,255,0.4)" }}>
                <Activity size={48} style={{ marginBottom: "20px", opacity: 0.5, color: "#FF6A00" }} />
                <h3 style={{ fontSize: "20px", fontWeight: "800", textTransform: "uppercase" }}>NO {activeTab} EVENTS</h3>
                <p style={{ fontSize: "14px", marginTop: "8px" }}>Check back later for fresh and exciting world record showdowns!</p>
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>

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

          {/* SPECTATOR PASS CARD */}
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
            <h4 style={{ fontSize: "40px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px", lineHeight: "1", position: "relative", zIndex: 2 }}>SPECTATOR <br /> PASS</h4>
            <p style={{ fontSize: "15px", fontWeight: "600", color: "rgba(255,255,255,0.9)", lineHeight: "1.6", marginBottom: "40px", maxWidth: "320px", position: "relative", zIndex: 2 }}>
              Live events are spectator and ticketed events between contestants already selected. Secure your seat to witness history.
            </p>
            <Link to="/shop?category=tickets" style={{ textDecoration: "none", width: "fit-content", position: "relative", zIndex: 2 }}>
              <button style={{ background: "#000", color: "white", border: "none", borderRadius: "100px", padding: "18px 40px", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}>
                Purchase Your Ticket Now <ArrowRight size={18} />
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
