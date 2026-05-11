import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  ArrowLeft,
  Trophy, 
  Target, 
  Zap, 
  Activity, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  Globe, 
  Medal,
  User,
  Flag
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("GLOBAL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const podiumData = {
    GLOBAL: [
      { rank: 2, name: "MARCUS V.", score: "12,450", medal: "SILVER", avatar: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=200&q=80" },
      { rank: 1, name: "ELARA K.", score: "14,820", medal: "GOLD", avatar: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=200&q=80" },
      { rank: 3, name: "JAXSON R.", score: "11,900", medal: "BRONZE", avatar: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=200&q=80" }
    ],
    NATIONAL: [
      { rank: 2, name: "THOMAS B.", score: "8,450", medal: "SILVER", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { rank: 1, name: "EMMA S.", score: "9,820", medal: "GOLD", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
      { rank: 3, name: "DAVID L.", score: "7,900", medal: "BRONZE", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" }
    ],
    "PRO DIVISION": [
      { rank: 2, name: "VIKTOR K.", score: "22,450", medal: "SILVER", avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=200&q=80" },
      { rank: 1, name: "SARAH P.", score: "24,820", medal: "GOLD", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
      { rank: 3, name: "MIKE T.", score: "21,900", medal: "BRONZE", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ],
    LEGENDS: [
      { rank: 2, name: "OLD GUARD", score: "42,450", medal: "SILVER", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
      { rank: 1, name: "THE TITAN", score: "44,820", medal: "GOLD", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
      { rank: 3, name: "IRON MIKE", score: "41,900", medal: "BRONZE", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" }
    ]
  };

  const rankingsData = {
    GLOBAL: [
      { rank: "#4", name: "SARAH JENKINS", country: "USA", score: "10,540", status: "UP 2", statusColor: "#4ADE80" },
      { rank: "#5", name: "CHEN WEI", country: "CHN", score: "10,210", status: "STABLE", statusColor: "#94A3B8" },
      { rank: "#6", name: "YOU (ELITE)", country: "GBR", score: "9,880", status: "DOWN 1", statusColor: "#F87171", highlighted: true },
      { rank: "#7", name: "MARTA GARCIA", country: "ESP", score: "9,420", status: "UP 4", statusColor: "#4ADE80" },
      { rank: "#8", name: "LIAM O'REILLY", country: "IRL", score: "9,110", status: "STABLE", statusColor: "#94A3B8" }
    ],
    NATIONAL: [
      { rank: "#4", name: "JOHN DOE", country: "GBR", score: "7,540", status: "UP 1", statusColor: "#4ADE80" },
      { rank: "#5", name: "JANE SMITH", country: "GBR", score: "7,210", status: "STABLE", statusColor: "#94A3B8" },
      { rank: "#6", name: "YOU (ELITE)", country: "GBR", score: "9,880", status: "UP 5", statusColor: "#4ADE80", highlighted: true },
      { rank: "#7", name: "PETER PAN", country: "GBR", score: "6,420", status: "DOWN 2", statusColor: "#F87171" }
    ],
    "PRO DIVISION": [
      { rank: "#4", name: "PRO ONE", country: "USA", score: "19,540", status: "STABLE", statusColor: "#94A3B8" },
      { rank: "#5", name: "PRO TWO", country: "CAN", score: "19,210", status: "UP 2", statusColor: "#4ADE80" },
      { rank: "#6", name: "YOU (ELITE)", country: "GBR", score: "9,880", status: "DOWN 12", statusColor: "#F87171", highlighted: true }
    ],
    LEGENDS: [
      { rank: "#4", name: "LEGEND A", country: "GRE", score: "39,540", status: "STABLE", statusColor: "#94A3B8" },
      { rank: "#5", name: "LEGEND B", country: "ITA", score: "39,210", status: "UP 1", statusColor: "#4ADE80" }
    ]
  };

  const filteredRankings = (rankingsData[activeTab] || []).filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentPodium = podiumData[activeTab] || [];

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        
        {/* NAVBAR */}
        <Navbar />

        <div style={{ padding: "60px 5% 0" }}>
        
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
           <h3 style={{ color: "#FF6A00", fontSize: "11px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "12px", textTransform: "uppercase" }}>LEADERBOARD</h3>
           <h1 style={{ fontSize: "72px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "1" }}>
             <ScrollReveal>{activeTab} Ranking</ScrollReveal>
           </h1>
        </div>
        
        {/* PODIUM SECTION */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "40px", marginBottom: "80px", paddingTop: "40px" }}>
          {currentPodium.map((p) => (
            <div key={p.rank} style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              order: p.rank === 1 ? 2 : p.rank === 2 ? 1 : 3,
              marginBottom: p.rank === 1 ? "40px" : "0"
            }}>
              <div style={{ position: "relative", marginBottom: "20px" }}>
                <div style={{ 
                  width: p.rank === 1 ? "160px" : "120px", 
                  height: p.rank === 1 ? "160px" : "120px", 
                  borderRadius: "50%", 
                  border: p.rank === 1 ? "4px solid #FF6A00" : "2px solid rgba(255,255,255,0.1)",
                  padding: "4px",
                  background: "rgba(255,255,255,0.02)"
                }}>
                  <img src={p.avatar} alt={p.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                </div>
                <div style={{ 
                  position: "absolute", 
                  bottom: "-10px", 
                  left: "50%", 
                  transform: "translateX(-50%)", 
                  background: p.rank === 1 ? "#FF6A00" : "#222", 
                  padding: "4px 16px", 
                  borderRadius: "100px", 
                  fontSize: "10px", 
                  fontWeight: "900",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                }}>
                  {p.medal} <br/> #{p.rank}
                </div>
              </div>
              <h3 style={{ fontSize: "20px", fontWeight: "950", marginBottom: "4px", textTransform: "uppercase" }}>{p.name}</h3>
              <div style={{ background: "rgba(255,106,0,0.1)", padding: "6px 20px", borderRadius: "100px", color: "#FF6A00", fontSize: "18px", fontWeight: "950" }}>
                {p.score}
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH & FILTERS */}
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ position: "relative", marginBottom: "32px" }}>
            <Search style={{ position: "absolute", left: "24px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }} size={20} />
            <input 
              type="text" 
              placeholder="SEARCH ATHLETES" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "20px", padding: "20px 20px 20px 64px", color: "white", fontSize: "14px", fontWeight: "700", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", marginBottom: "48px" }}>
            {["GLOBAL", "NATIONAL", "PRO DIVISION", "LEGENDS"].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{ 
                  padding: "12px 32px", 
                  borderRadius: "100px", 
                  background: activeTab === tab ? "#FF6A00" : "rgba(255,255,255,0.05)", 
                  color: activeTab === tab ? "white" : "rgba(255,255,255,0.5)", 
                  border: "none", 
                  fontSize: "12px", 
                  fontWeight: "900", 
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TABLE */}
          <div style={{ background: "rgba(255,255,255,0.01)", borderRadius: "32px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 120px 120px", padding: "24px 40px", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              <div>RANK</div>
              <div>ATHLETE</div>
              <div style={{ textAlign: "right" }}>SCORE</div>
              <div style={{ textAlign: "right" }}>STATUS</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              {filteredRankings.length > 0 ? filteredRankings.map((r, i) => (
                <div key={i} style={{ 
                  display: "grid", 
                  gridTemplateColumns: "80px 1fr 120px 120px", 
                  padding: "24px 40px", 
                  alignItems: "center",
                  background: r.highlighted ? "rgba(255,106,0,0.03)" : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  position: "relative"
                }}>
                  {r.highlighted && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "#FF6A00" }}></div>}
                  
                  <div style={{ fontSize: "24px", fontWeight: "950", opacity: r.highlighted ? 1 : 0.6, color: r.highlighted ? "#FF6A00" : "white" }}>{r.rank}</div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <img src={`https://i.pravatar.cc/150?u=${r.name}`} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: "800", color: r.highlighted ? "#FF6A00" : "white" }}>{r.name}</div>
                      <div style={{ fontSize: "10px", fontWeight: "700", color: "rgba(255,255,255,0.4)", display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                        <Flag size={10} /> {r.country}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right", fontSize: "18px", fontWeight: "950" }}>{r.score}</div>
                  
                  <div style={{ textAlign: "right", fontSize: "10px", fontWeight: "900", color: r.statusColor, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                    {r.status === "UP 2" || r.status === "UP 4" || r.status === "UP 1" || r.status === "UP 5" ? <ChevronUp size={12} /> : r.status === "DOWN 1" || r.status === "DOWN 2" || r.status === "DOWN 12" ? <ChevronDown size={12} /> : null}
                    {r.status}
                  </div>
                </div>
              )) : (
                <div style={{ padding: "80px", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "900", textTransform: "uppercase" }}>
                  No athletes found matching your search.
                </div>
              )}
            </div>
          </div>
          
          <div style={{ textAlign: "center", marginTop: "48px" }}>
             <button 
               onMouseEnter={() => setIsHovered(true)}
               onMouseLeave={() => setIsHovered(false)}
               style={{ 
                 background: isHovered ? "#FF6A00" : "transparent", 
                 border: isHovered ? "1px solid #FF6A00" : "1px solid rgba(255,255,255,0.1)", 
                 color: isHovered ? "white" : "rgba(255,255,255,0.4)", 
                 padding: "16px 48px", 
                 borderRadius: "100px", 
                 fontSize: "13px", 
                 fontWeight: "900", 
                 textTransform: "uppercase", 
                 cursor: "pointer",
                 transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                 transform: isHovered ? "scale(1.05)" : "scale(1)",
                 boxShadow: isHovered ? "0 20px 40px rgba(255, 106, 0, 0.3)" : "none"
               }}
             >
               LOAD FULL RANKINGS
             </button>
          </div>
        </div>
        </div>
        
        <div style={{ marginTop: "120px" }}>
          <Footer />
        </div>
      </div>
    </PageTransition>
  );
};

export default Leaderboard;
