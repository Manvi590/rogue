import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import LiquidButton from "../components/LiquidButton";

const Challenges = () => {
  const categories = ["ALL", "STRENGTH", "ENDURANCE", "AGILITY", "COMBAT"];

  const challengeCards = [
    { 
      id: 1, 
      title: "THE ROGUE MEDLEY", 
      participants: "2.1K", 
      difficulty: "HARD", 
      cat: "STRENGTH",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "IRON LUNGS", 
      participants: "800", 
      difficulty: "ROGUE", 
      cat: "ENDURANCE",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 3, 
      title: "LIGHTNING REFLEX", 
      participants: "1.2K", 
      difficulty: "PRO", 
      cat: "AGILITY",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 4, 
      title: "TIRE FLIP GAUNTLET", 
      participants: "500", 
      difficulty: "HARD", 
      cat: "STRENGTH",
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80" 
    },
  ];

  const [activeTab, setActiveTab] = useState("ALL");

  const filteredChallenges = activeTab === "ALL" 
    ? challengeCards 
    : challengeCards.filter(c => c.cat === activeTab);

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingTop: "180px", display: "flex", flexDirection: "column" }}>
        
        {/* NAVBAR */}
        <Navbar />

        {/* TOP HEADER - ACTIVE CHALLENGES */}
        <div style={{ padding: "40px 5% 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", color: "#FF6A00", letterSpacing: "0.1em" }}>ACTIVE CHALLENGES</h2>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>{filteredChallenges.length} AVAILABLE</span>
        </div>

        {/* MINI CHALLENGE CARDS */}
        <div style={{ padding: "0 5% 60px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            { title: "1000M ROW SPRINT", tag: "ELITE STATUS", progress: "40%" },
            { title: "ROGUE PLANK HOLD", tag: "TIME TRIAL", progress: "75%" }
          ].map((c, idx) => (
            <div key={idx} style={{ background: "#161616", padding: "20px 24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", width: "240px" }}>
              <div style={{ fontSize: "9px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase" }}>{c.tag}</div>
              <div style={{ fontSize: "14px", fontWeight: "800", marginBottom: "16px" }}>{c.title}</div>
              <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                <div style={{ width: c.progress, height: "100%", background: "#FF6A00", borderRadius: "2px" }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* HERO SECTION - FEATURED CHALLENGE */}
        <div style={{ position: "relative", height: "600px", margin: "0 5%", borderRadius: "40px", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80" 
            alt="Featured Challenge" 
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.9), transparent)" }} />
          
          <div style={{ position: "relative", zIndex: 2, padding: "0 80px" }}>
            <div style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "16px", letterSpacing: "0.1em" }}>
              CHALLENGE OF THE MONTH
            </div>
            <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "950", textTransform: "uppercase", lineHeight: "0.9", letterSpacing: "-0.04em", marginBottom: "20px" }}>
              <ScrollReveal>THE APEX</ScrollReveal> <br />
              <span style={{ color: "#FF6A00" }}><ScrollReveal>DECATHLON</ScrollReveal></span>
            </h1>
            
            <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>PARTICIPANTS</div>
                <div style={{ fontSize: "18px", fontWeight: "900" }}>12.4K</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>DIFFICULTY</div>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "#FF6A00" }}>ROGUE</div>
              </div>
            </div>

            <LiquidButton 
              text="CHALLENGE RECORD" 
              to="/challenge-verify" 
            />
          </div>
        </div>

        {/* FILTERS */}
        <div style={{ padding: "80px 5% 40px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{ 
                padding: "10px 24px", 
                borderRadius: "100px", 
                background: activeTab === cat ? "#FF6A00" : "rgba(255, 255, 255, 0.05)", 
                color: activeTab === cat ? "white" : "rgba(255, 255, 255, 0.5)", 
                border: "none", 
                fontSize: "11px", 
                fontWeight: "900", 
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CHALLENGE GRID */}
        <div style={{ padding: "0 5% 100px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))", gap: "32px" }}>
          {filteredChallenges.map((card) => (
            <div key={card.id} style={{ position: "relative", height: "300px", borderRadius: "24px", overflow: "hidden" }}>
              <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.9), transparent)" }} />
              
              <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", gap: "8px" }}>
                <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900" }}>{card.difficulty} LEVEL</div>
                <div style={{ background: "rgba(255,106,0,0.2)", color: "#FF6A00", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900" }}>{card.participants} PARTICIPATING</div>
              </div>

              <div style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <h3 style={{ fontSize: "28px", fontWeight: "900", textTransform: "uppercase" }}>{card.title}</h3>
                <LiquidButton 
                  text="CHALLENGE RECORD" 
                  to="/challenge-verify" 
                  style={{ padding: "12px 24px", fontSize: "11px" }} 
                  circleStyle={{ width: "20px", height: "20px" }} 
                  iconSize={12} 
                />
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <Footer />

      </div>
    </PageTransition>
  );
};

export default Challenges;
