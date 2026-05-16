import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Globe, 
  Zap, 
  ArrowRight,
  TrendingUp,
  Activity,
  Flag,
  Search,
  Award,
  Crown,
  Star,
  Users
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const GlobalLeaderboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Worldwide Top 100");

  const filters = [
    "Worldwide Top 100",
    "Most Records Held",
    "Highest Points Earned",
    "Most Verified Wins",
    "Fastest Rising",
    "All-Time Greatest"
  ];

  const mockGlobalData = [
    { rank: "#01", name: "Leo Vance", points: 24850, country: "USA", records: 12, trend: "+2", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { rank: "#02", name: "Elena Petrov", points: 22410, country: "RUS", records: 10, trend: "-1", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { rank: "#03", name: "Jamal Carter", points: 21900, country: "GBR", records: 15, trend: "STABLE", avatar: "https://randomuser.me/api/portraits/men/85.jpg" },
    { rank: "#04", name: "Sarah Kim", points: 19540, country: "KOR", records: 8, trend: "+5", avatar: "https://randomuser.me/api/portraits/women/15.jpg" },
    { rank: "#05", name: "Marcus Rossi", points: 18210, country: "ITA", records: 9, trend: "STABLE", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
    { rank: "#06", name: "Chen Wei", points: 17800, country: "CHN", records: 11, trend: "-2", avatar: "https://randomuser.me/api/portraits/men/45.jpg" },
    { rank: "#07", name: "Mina Chen", points: 16950, country: "JPN", records: 7, trend: "+1", avatar: "https://randomuser.me/api/portraits/women/22.jpg" },
    { rank: "#08", name: "David Lu", points: 15400, country: "CAN", records: 6, trend: "STABLE", avatar: "https://randomuser.me/api/portraits/men/76.jpg" }
  ];

  const getFilteredData = () => {
    let data = [...mockGlobalData];
    
    // Search filter
    if (searchQuery) {
      data = data.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        item.country.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by criteria
    if (activeFilter === "Most Records Held") {
      data.sort((a, b) => b.records - a.records);
    } else if (activeFilter === "Highest Points Earned") {
      data.sort((a, b) => b.points - a.points);
    } else if (activeFilter === "Worldwide Top 100") {
      data.sort((a, b) => b.points - a.points);
    }

    return data;
  };

  const filteredData = getFilteredData();

  return (
    <PageTransition>
      <div style={{ background: "#050505", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* HERO SECTION - GLOBAL VIBE */}
        <section style={{ padding: "180px 5% 100px", position: "relative", overflow: "hidden", textAlign: "center" }}>
          {/* Background elements */}
          <div style={{ position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "100%", height: "100%", background: "radial-gradient(circle at center, rgba(255,106,0,0.08) 0%, transparent 70%)", zIndex: 0 }} />
          
          <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,106,0,0.1)", border: "1px solid rgba(255,106,0,0.2)", padding: "8px 20px", borderRadius: "100px", marginBottom: "32px" }}
            >
              <Globe size={16} color="#FF6A00" />
              <span style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.15em", textTransform: "uppercase" }}>WORLDWIDE ELITE STANDINGS</span>
            </motion.div>

            <h1 style={{ fontSize: "clamp(48px, 8vw, 120px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.9", marginBottom: "40px" }}>
              <ScrollReveal>GLOBAL</ScrollReveal><br />
              <span style={{ color: "#FF6A00" }}><ScrollReveal>RANKINGS</ScrollReveal></span>
            </h1>
            
            <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)", maxWidth: "700px", margin: "0 auto 60px", lineHeight: "1.6" }}>
              The definitive list of the greatest record breakers on the planet. Ranks are determined by total verified records and points accumulated across all disciplines.
            </p>

            {/* QUICK STATS */}
            <div style={{ display: "flex", justifyContent: "center", gap: "40px", flexWrap: "wrap" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px", fontWeight: "900", color: "white" }}>195</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: "4px" }}>Countries</div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px", fontWeight: "900", color: "white" }}>12.4K</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: "4px" }}>Athletes</div>
              </div>
              <div style={{ width: "1px", background: "rgba(255,255,255,0.1)", alignSelf: "stretch" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "32px", fontWeight: "900", color: "white" }}>$2.5M</div>
                <div style={{ fontSize: "11px", fontWeight: "700", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginTop: "4px" }}>Prize Pool</div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN STANDINGS */}
        <section style={{ padding: "0 5% 160px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            {/* FILTER BAR */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "48px", 
              gap: "24px",
              flexWrap: "wrap",
              background: "rgba(255,255,255,0.02)",
              padding: "12px",
              borderRadius: "20px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ display: "flex", gap: "8px", overflowX: "auto", padding: "4px" }} className="no-scrollbar">
                {filters.map(f => (
                  <button 
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    style={{ 
                      background: activeFilter === f ? "#FF6A00" : "transparent",
                      color: activeFilter === f ? "white" : "rgba(255,255,255,0.4)",
                      border: "none",
                      padding: "12px 24px",
                      borderRadius: "12px",
                      fontSize: "13px",
                      fontWeight: "800",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {f}
                  </button>
                ))}
              </div>
              
              <div style={{ position: "relative", minWidth: "300px", flex: "1" }}>
                <Search style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} size={18} />
                <input 
                  type="text" 
                  placeholder="SEARCH WORLDWIDE ATHLETES..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ 
                    width: "100%", 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    borderRadius: "14px", 
                    padding: "16px 20px 16px 54px", 
                    color: "white", 
                    fontSize: "14px", 
                    fontWeight: "700", 
                    outline: "none" 
                  }}
                />
              </div>
            </div>

            {/* STANDINGS TABLE */}
            <div style={{ background: "rgba(255,255,255,0.01)", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
              {/* Header row */}
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "100px 1fr 180px 180px 180px", 
                padding: "24px 48px", 
                background: "rgba(255,255,255,0.02)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                fontSize: "11px",
                fontWeight: "900",
                color: "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: "0.15em"
              }}>
                <div>Rank</div>
                <div>Athlete</div>
                <div style={{ textAlign: "right" }}>Records Held</div>
                <div style={{ textAlign: "right" }}>Total Points</div>
                <div style={{ textAlign: "right" }}>Trend</div>
              </div>

              {filteredData.map((r, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    display: "grid", 
                    gridTemplateColumns: "100px 1fr 180px 180px 180px", 
                    padding: "32px 48px", 
                    alignItems: "center", 
                    borderBottom: i === mockGlobalData.length - 1 ? "none" : "1px solid rgba(255,255,255,0.03)",
                    background: i < 3 ? "rgba(255,106,0,0.02)" : "transparent",
                    transition: "background 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,106,0,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = i < 3 ? "rgba(255,106,0,0.02)" : "transparent"}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {i === 0 && <Crown size={16} color="#FFD700" />}
                    <div style={{ 
                      fontSize: i < 3 ? "28px" : "20px", 
                      fontWeight: "950", 
                      color: i < 3 ? "#FF6A00" : "rgba(255,255,255,0.2)",
                      fontStyle: i < 3 ? "italic" : "normal"
                    }}>
                      #{String(i + 1).padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <div style={{ position: "relative" }}>
                      <img src={r.avatar} alt={r.name} style={{ width: "56px", height: "56px", borderRadius: "16px", border: i < 3 ? "2px solid #FF6A00" : "1px solid rgba(255,255,255,0.1)" }} />
                      {i < 3 && <div style={{ position: "absolute", top: -5, right: -5, background: "#FF6A00", color: "white", padding: "4px", borderRadius: "50%" }}><Star size={10} fill="white" /></div>}
                    </div>
                    <div>
                      <div style={{ fontSize: "18px", fontWeight: "900", letterSpacing: "-0.02em" }}>{r.name}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }}>
                        <Flag size={12} /> {r.country}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "20px", fontWeight: "950", color: "white" }}>{r.records}</span>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "20px", fontWeight: "950", color: "#FF6A00" }}>{r.points.toLocaleString()}</span>
                  </div>

                  <div style={{ 
                    textAlign: "right", 
                    fontSize: "12px", 
                    fontWeight: "900", 
                    color: r.trend.includes("+") ? "#4ADE80" : r.trend.includes("-") ? "#F87171" : "#94A3B8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: "6px"
                  }}>
                    {r.trend === "STABLE" ? <Activity size={14} /> : <TrendingUp size={14} style={{ transform: r.trend.includes("-") ? "rotate(180deg)" : "none" }} />}
                    {r.trend}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CALL TO ACTION */}
            <div style={{ marginTop: "80px", textAlign: "center" }}>
              <Link to="/verify" style={{ textDecoration: "none" }}>
                <button style={{ 
                  background: "linear-gradient(135deg, #FF6A00, #FF3D00)", 
                  color: "white", 
                  padding: "24px 60px", 
                  borderRadius: "100px", 
                  border: "none", 
                  fontSize: "16px", 
                  fontWeight: "950", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em",
                  cursor: "pointer", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: "16px",
                  boxShadow: "0 20px 50px rgba(255,106,0,0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 30px 60px rgba(255,106,0,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 20px 50px rgba(255,106,0,0.3)"; }}
                >
                  START YOUR ASCENT <ArrowRight size={20} />
                </button>
              </Link>
              <p style={{ marginTop: "24px", color: "rgba(255,255,255,0.3)", fontSize: "14px", fontWeight: "600" }}>
                Every verified record earns points toward the Global Standings.
              </p>
            </div>

          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default GlobalLeaderboard;
