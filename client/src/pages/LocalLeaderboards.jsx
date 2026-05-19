import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Trophy, 
  MapPin, 
  Search,
  Flag,
  ArrowRight,
  ChevronRight,
  Star,
  Globe2,
  TrendingUp,
  Award
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";

const CustomSelect = ({ value, onChange, options, label }) => (
  <div style={{ position: "relative", flex: "1", minWidth: "180px" }}>
    <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>{label}</label>
    <div style={{ position: "relative" }}>
      <select 
        value={value} 
        onChange={e => onChange(e.target.value)}
        style={{ 
          width: "100%", 
          appearance: "none", 
          background: "rgba(255,255,255,0.03)", 
          border: "1px solid rgba(255,255,255,0.05)", 
          borderRadius: "12px", 
          padding: "12px 40px 12px 16px", 
          color: "white", 
          fontSize: "13px", 
          fontWeight: "800", 
          outline: "none",
          cursor: "pointer",
          transition: "all 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
      >
        {options.map(opt => <option key={opt} value={opt} style={{ background: "#111", color: "white" }}>{opt}</option>)}
      </select>
      <div style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>▼</div>
    </div>
  </div>
);

const LocalLeaderboards = () => {
  const [selectedCountry, setSelectedCountry] = useState("United States");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Athletics");
  const [activeAgeGroup, setActiveAgeGroup] = useState("All Ages");
  const [activeSort, setActiveSort] = useState("Highest Score");

  const ageGroups = ["All Ages", "Junior Champions Division (5–12)", "Teen Legends Division (13–17)", "Adult Division (18–49)", "Masters Division (50+)"];
  const sortOptions = ["Highest Score", "Newest Records"];

  const countries = [
    { name: "United States", code: "USA", flag: "🇺🇸", competitors: "4,820" },
    { name: "Canada", code: "CAN", flag: "🇨🇦", competitors: "1,940" },
    { name: "United Kingdom", code: "GBR", flag: "🇬🇧", competitors: "2,410" },
    { name: "Australia", code: "AUS", flag: "🇦🇺", competitors: "1,150" },
    { name: "Germany", code: "GER", flag: "🇩🇪", competitors: "980" }
  ];

  const categories = [
    "Athletics", 
    "Strength", 
    "Endurance", 
    "Balance", 
    "Skills", 
    "Gaming", 
    "Water Sports", 
    "Reaction", 
    "Mind & Memory", 
    "Action Sports", 
    "Other"
  ];

  // Using a flat array here so we can filter by country, category, and age division dynamically
  const mockLocalData = [
    { name: "Marcus Vance", country: "United States", category: "Strength", value: "355 KG", scoreNumeric: 355, date: "2026-05-18", event: "Bench Press", state: "Illinois", avatar: "https://randomuser.me/api/portraits/men/85.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Ryan Reynolds", country: "United States", category: "Strength", value: "310 KG", scoreNumeric: 310, date: "2026-05-10", event: "Bench Press", state: "California", avatar: "https://randomuser.me/api/portraits/men/14.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Jessica Alba", country: "United States", category: "Strength", value: "195 KG", scoreNumeric: 195, date: "2026-04-22", event: "Squat Hold", state: "Texas", avatar: "https://randomuser.me/api/portraits/women/45.jpg", ageGroup: "Teen Legends Division (13–17)" },
    { name: "Tyler Durden", country: "United States", category: "Strength", value: "290 KG", scoreNumeric: 290, date: "2026-03-10", event: "Deadlift", state: "New York", avatar: "https://randomuser.me/api/portraits/men/22.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "David Goggins", country: "United States", category: "Endurance", value: "17h 45m", scoreNumeric: 1745, date: "2026-05-01", event: "100 Mile Trail Run", state: "Indiana", avatar: "https://randomuser.me/api/portraits/men/33.jpg", ageGroup: "Masters Division (50+)" },
    { name: "Rich Roll", country: "United States", category: "Endurance", value: "19h 12m", scoreNumeric: 1912, date: "2026-02-14", event: "Ultra Tri-distance", state: "Hawaii", avatar: "https://randomuser.me/api/portraits/men/64.jpg", ageGroup: "Masters Division (50+)" },
    { name: "Max Park", country: "United States", category: "Gaming", value: "3.13 Sec", scoreNumeric: 313, date: "2026-05-19", event: "3x3 Rubik Solve", state: "California", avatar: "https://randomuser.me/api/portraits/men/90.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Christian Coleman", country: "United States", category: "Athletics", value: "9.76 Sec", scoreNumeric: 976, date: "2026-01-22", event: "100m Sprint", state: "Georgia", avatar: "https://randomuser.me/api/portraits/men/4.jpg", ageGroup: "Adult Division (18–49)" },
    
    { name: "Mitchell Hooper", country: "Canada", category: "Strength", value: "440 KG", scoreNumeric: 440, date: "2026-04-18", event: "Max Deadlift", state: "Ontario", avatar: "https://randomuser.me/api/portraits/men/55.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Jean-Francois", country: "Canada", category: "Strength", value: "410 KG", scoreNumeric: 410, date: "2026-03-05", event: "Atlas Stones", state: "Quebec", avatar: "https://randomuser.me/api/portraits/men/71.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Lionel Sanders", country: "Canada", category: "Endurance", value: "7h 44m", scoreNumeric: 744, date: "2026-05-11", event: "Ironman distance", state: "Ontario", avatar: "https://randomuser.me/api/portraits/men/11.jpg", ageGroup: "Adult Division (18–49)" },
    
    { name: "Eddie Hall", country: "United Kingdom", category: "Strength", value: "500 KG", scoreNumeric: 500, date: "2026-02-18", event: "Deadlift Max", state: "Staffordshire", avatar: "https://randomuser.me/api/portraits/men/12.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Tom Stoltman", country: "United Kingdom", category: "Strength", value: "286 KG", scoreNumeric: 286, date: "2026-05-01", event: "Atlas Stones", state: "Scotland", avatar: "https://randomuser.me/api/portraits/men/47.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Alistair Brownlee", country: "United Kingdom", category: "Endurance", value: "1h 45m", scoreNumeric: 145, date: "2026-03-12", event: "Olympic Triathlon", state: "Yorkshire", avatar: "https://randomuser.me/api/portraits/men/29.jpg", ageGroup: "Adult Division (18–49)" },
    { name: "Timmy Jenkins", country: "United Kingdom", category: "Gaming", value: "12,500 Pts", scoreNumeric: 12500, date: "2026-05-18", event: "Arcade High Score", state: "London", avatar: "https://randomuser.me/api/portraits/men/19.jpg", ageGroup: "Junior Champions Division (5–12)" }
  ];

  const getRankings = () => {
    let list = mockLocalData.filter(item => item.country === selectedCountry && item.category === activeCategory);
    
    if (activeAgeGroup !== "All Ages") {
      list = list.filter(item => item.ageGroup === activeAgeGroup);
    }
    
    if (searchQuery) {
      list = list.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeSort === "Highest Score") {
      // In a real app we'd use standardized numeric metrics. Here we use the mock scoreNumeric.
      list.sort((a, b) => b.scoreNumeric - a.scoreNumeric);
    } else if (activeSort === "Newest Records") {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    // Assign dynamic local ranks after sort
    return list.map((item, index) => ({ ...item, rank: index + 1 }));
  };

  const currentRankings = getRankings();

  return (
    <PageTransition>
      <div style={{ background: "#060606", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* HERO SECTION */}
        <section style={{ padding: "180px 5% 60px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "400px", background: "linear-gradient(to bottom, rgba(255,106,0,0.05) 0%, transparent 100%)", pointerEvents: "none" }} />
          
          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <span style={{ fontSize: "11px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.2em", textTransform: "uppercase" }}>National & Local Divisions</span>
            </div>
            
            <h1 style={{ fontSize: "clamp(44px, 7vw, 90px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.95", marginBottom: "32px" }}>
              LOCAL<br />
              <span style={{ color: "#FF6A00" }}>LEADERBOARDS</span>
            </h1>
            
            <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.5)", maxWidth: "650px", lineHeight: "1.6" }}>
              Compete on your home turf. Filter by country, division, and age group to find top local record breakers and assert your local dominance.
            </p>
          </div>
        </section>

        {/* COUNTRY SELECTOR CARDS */}
        <section style={{ padding: "0 5% 40px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "60px" }}>
              {countries.map(c => (
                <div
                  key={c.name}
                  onClick={() => setSelectedCountry(c.name)}
                  style={{
                    background: selectedCountry === c.name ? "linear-gradient(135deg, #FF6A00, #FF3D00)" : "rgba(255,255,255,0.02)",
                    border: selectedCountry === c.name ? "none" : "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "24px",
                    padding: "28px 24px",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    transform: selectedCountry === c.name ? "translateY(-4px)" : "translateY(0)",
                    boxShadow: selectedCountry === c.name ? "0 10px 30px rgba(255,106,0,0.2)" : "none"
                  }}
                  onMouseEnter={e => {
                    if (selectedCountry !== c.name) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedCountry !== c.name) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                    }
                  }}
                >
                  <div style={{ fontSize: "36px", marginBottom: "16px" }}>{c.flag}</div>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "6px" }}>{c.name}</h3>
                  <div style={{ fontSize: "12px", color: selectedCountry === c.name ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", fontWeight: "700" }}>
                    {c.competitors} COMPETITORS
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DETAILS SECTION */}
        <section style={{ padding: "0 5% 120px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "48px", alignItems: "start" }}>
              
              {/* Left Sidebar Category selectors */}
              <aside style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "20px" }}>
                <h4 style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.15em", padding: "0 12px 16px" }}>DISCIPLINE</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      style={{
                        background: activeCategory === cat ? "rgba(255,106,0,0.1)" : "transparent",
                        color: activeCategory === cat ? "#FF6A00" : "white",
                        border: "none",
                        padding: "12px 20px",
                        borderRadius: "14px",
                        fontWeight: "800",
                        fontSize: "13px",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {
                        if(activeCategory !== cat) e.currentTarget.style.background = "rgba(255,255,255,0.03)"
                      }}
                      onMouseLeave={e => {
                        if(activeCategory !== cat) e.currentTarget.style.background = "transparent"
                      }}
                    >
                      {cat}
                      <ChevronRight size={14} style={{ opacity: activeCategory === cat ? 1 : 0 }} />
                    </button>
                  ))}
                </div>
              </aside>

              {/* Right Main Table */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "20px" }}>
                  <h2 style={{ fontSize: "28px", fontWeight: "950", textTransform: "uppercase", lineHeight: "1.2" }}>
                    {selectedCountry} — {activeCategory}
                  </h2>
                </div>

                {/* Local Filters */}
                <div style={{ 
                  display: "flex", 
                  marginBottom: "32px", 
                  gap: "16px",
                  flexWrap: "wrap",
                  background: "rgba(255,255,255,0.02)",
                  padding: "16px",
                  borderRadius: "20px",
                  border: "1px solid rgba(255,255,255,0.05)"
                }}>
                  <CustomSelect label="Age Group" value={activeAgeGroup} onChange={setActiveAgeGroup} options={ageGroups} />
                  <CustomSelect label="Sort By" value={activeSort} onChange={setActiveSort} options={sortOptions} />
                  
                  <div style={{ position: "relative", minWidth: "200px", flex: "1" }}>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>Search Local</label>
                    <Search style={{ position: "absolute", left: "16px", top: "35px", color: "rgba(255,255,255,0.3)" }} size={16} />
                    <input
                      type="text"
                      placeholder="Athlete or Event..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      style={{
                        width: "100%",
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "12px",
                        padding: "12px 20px 12px 40px",
                        fontSize: "13px",
                        fontWeight: "800",
                        outline: "none",
                        color: "white",
                        transition: "all 0.2s"
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = "#FF6A00"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                    />
                  </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.01)", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  {currentRankings.length > 0 ? (
                    currentRankings.map((r, i) => (
                      <div
                        key={i}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "80px 1.5fr 200px 150px",
                          padding: "24px 32px",
                          alignItems: "center",
                          borderBottom: i === currentRankings.length - 1 ? "none" : "1px solid rgba(255,255,255,0.03)",
                          background: i === 0 && activeSort === "Highest Score" ? "rgba(255,106,0,0.02)" : "transparent",
                          transition: "background 0.3s ease",
                          cursor: "pointer"
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,106,0,0.05)"}
                        onMouseLeave={(e) => e.currentTarget.style.background = i === 0 && activeSort === "Highest Score" ? "rgba(255,106,0,0.02)" : "transparent"}
                      >
                        <div style={{ fontSize: "24px", fontWeight: "950", color: i === 0 && activeSort === "Highest Score" ? "#FF6A00" : "rgba(255,255,255,0.2)" }}>
                          #{r.rank}
                        </div>
                        
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <img src={r.avatar} alt={r.name} style={{ width: "48px", height: "48px", borderRadius: "14px", objectFit: "cover" }} />
                          <div>
                            <div style={{ fontSize: "16px", fontWeight: "800" }}>{r.name}</div>
                            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "4px", marginTop: "2px" }}>
                              <MapPin size={10} color="#FF6A00" /> {r.state}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>{r.event}</div>
                          <div style={{ fontSize: "11px", fontWeight: "800", color: "#FF6A00", background: "rgba(255,106,0,0.1)", padding: "4px 8px", borderRadius: "6px", display: "inline-block", textTransform: "uppercase" }}>
                            {r.ageGroup.split(" (")[0]}
                          </div>
                        </div>

                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "20px", fontWeight: "950", color: "white" }}>{r.value}</div>
                          <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>{r.date}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "80px 40px", textAlign: "center" }}>
                      <Trophy size={40} color="rgba(255,255,255,0.1)" style={{ marginBottom: "16px" }} />
                      <h3 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "8px" }}>No rankings recorded yet</h3>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", maxWidth: "400px", margin: "0 auto 24px" }}>
                        Be the pioneer in your region! Record your athletic evidence and hold the prime spot in the {selectedCountry} leaderboard.
                      </p>
                      <Link to="/verify" style={{ textDecoration: "none" }}>
                        <button style={{ background: "#FF6A00", color: "white", padding: "14px 32px", borderRadius: "100px", border: "none", fontWeight: "800", fontSize: "13px", cursor: "pointer" }}>
                          Claim Prime Rank
                        </button>
                      </Link>
                    </div>
                  )}
                </div>

                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginTop: "24px", textAlign: "center" }}>
                  * Local leaderboards are refreshed in real-time under multi-stage regional IP audits.
                </p>
              </div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default LocalLeaderboards;
