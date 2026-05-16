import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  Target, 
  Zap, 
  ArrowRight,
  Search,
  Flag,
  Activity,
  ChevronRight,
  Star,
  Users,
  Timer,
  Gamepad2,
  Bike,
  Baby
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { motion } from "framer-motion";

const Leaderboard = () => {
  const [activeCategory, setActiveCategory] = useState("Strength");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Strength", icon: <Trophy size={18} /> },
    { name: "Gaming", icon: <Gamepad2 size={18} /> },
    { name: "Endurance", icon: <Timer size={18} /> },
    { name: "Teen", icon: <Users size={18} /> },
    { name: "Monthly", icon: <Zap size={18} /> },
    { name: "Country", icon: <Flag size={18} /> }
  ];

  const mockRankings = [
    { rank: "#1", name: "Marcus S.", result: "89 Reps", event: "Pull-Ups", country: "USA", avatar: "https://randomuser.me/api/portraits/men/85.jpg" },
    { rank: "#2", name: "Elena Petrov", result: "11.2 Sec", event: "100m Sand Sprint", country: "RUS", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { rank: "#3", name: "James Carter", result: "42 Shots", event: "Basketball 3-Pointers", country: "GBR", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { rank: "#4", name: "Leo Rossi", result: "1h 12m", event: "Plank Hold", country: "ITA", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
    { rank: "#5", name: "Sarah Kim", result: "999,999", event: "Retro Tetris", country: "KOR", avatar: "https://randomuser.me/api/portraits/women/15.jpg" }
  ];

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* HERO SECTION - CATEGORY FOCUS */}
        <section style={{ padding: "180px 5% 80px", position: "relative", overflow: "hidden" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
              <span style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.2em", textTransform: "uppercase" }}>Division Standings</span>
            </div>
            <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.03em", lineHeight: "1.0", marginBottom: "32px" }}>
              CATEGORY<br />
              <span style={{ color: "#FF6A00" }}>LEADERBOARDS</span>
            </h1>
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: "1.6" }}>
              Track rankings across specific disciplines, events, and age groups. Find your niche and compete for the top spot in your chosen field.
            </p>
          </div>
        </section>

        {/* CATEGORY SELECTOR */}
        <section style={{ padding: "0 5% 120px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "48px" }}>
              
              {/* Sidebar Filters */}
              <aside>
                <div style={{ background: "rgba(255,255,255,0.02)", padding: "24px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <h3 style={{ fontSize: "14px", fontWeight: "900", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "20px" }}>Select Discipline</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {categories.map(cat => (
                      <button 
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "space-between",
                          background: activeCategory === cat.name ? "#FF6A00" : "transparent",
                          color: activeCategory === cat.name ? "white" : "white",
                          border: "none",
                          padding: "14px 20px",
                          borderRadius: "14px",
                          fontSize: "15px",
                          fontWeight: "700",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ color: activeCategory === cat.name ? "white" : "#FF6A00" }}>{cat.icon}</span>
                          {cat.name}
                        </div>
                        <ChevronRight size={14} style={{ opacity: activeCategory === cat.name ? 1 : 0.2 }} />
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: "32px", padding: "32px", background: "rgba(255,106,0,0.05)", borderRadius: "24px", color: "white", position: "relative", overflow: "hidden", border: "1px solid rgba(255,106,0,0.1)" }}>
                  <div style={{ position: "absolute", top: -20, right: -20, opacity: 0.1 }}><Star size={120} color="#FF6A00" /></div>
                  <h4 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "12px" }}>Want to be listed?</h4>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6", marginBottom: "24px" }}>Submit your record evidence today and start your journey to the top.</p>
                  <Link to="/verify" style={{ textDecoration: "none" }}>
                    <button style={{ background: "#FF6A00", color: "white", border: "none", padding: "12px 20px", borderRadius: "100px", fontWeight: "800", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                      Submit Evidence <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </aside>

              {/* Main List */}
              <main>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                  <h2 style={{ fontSize: "28px", fontWeight: "950", textTransform: "uppercase" }}>{activeCategory} Rankings</h2>
                  <div style={{ position: "relative", width: "300px" }}>
                    <Search style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} size={16} />
                    <input 
                      type="text" 
                      placeholder="Search this category..."
                      style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "100px", padding: "12px 12px 12px 44px", fontSize: "14px", outline: "none", color: "white" }}
                    />
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.01)", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  {mockRankings.map((r, i) => (
                    <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 150px 150px", padding: "28px 40px", alignItems: "center", borderBottom: i === mockRankings.length - 1 ? "none" : "1px solid rgba(255,255,255,0.03)" }}>
                      <div style={{ fontSize: "20px", fontWeight: "900", color: i < 3 ? "#FF6A00" : "rgba(255,255,255,0.2)" }}>{r.rank}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                        <img src={r.avatar} alt={r.name} style={{ width: "44px", height: "44px", borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                        <div>
                          <div style={{ fontSize: "16px", fontWeight: "800" }}>{r.name}</div>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Flag size={10} /> {r.country}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>{r.event}</div>
                        <div style={{ fontSize: "18px", fontWeight: "900", color: "white" }}>{r.result}</div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <Link to={`/profile/${r.name.toLowerCase().replace(/\s+/g, '-')}`} style={{ color: "#FF6A00", fontSize: "13px", fontWeight: "800", textDecoration: "none" }}>
                          VIEW PROFILE
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "40px", textAlign: "center" }}>
                   <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "14px" }}>Showing top 5 of 1,240 competitors</p>
                </div>
              </main>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Leaderboard;
