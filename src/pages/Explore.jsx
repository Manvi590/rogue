import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Explore = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Athletics", "Strength", "Endurance", "Gaming", "Skills"];

  const records = [
    { 
      id: 1, 
      title: "Heaviest Deadlift Attempt", 
      value: "501 KG", 
      athlete: "Thor Bjornsson", 
      img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80",
      cat: "Strength"
    },
    { 
      id: 2, 
      title: "Fastest 100m Sprint", 
      value: "9.58 S", 
      athlete: "Usain Bolt", 
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80",
      cat: "Athletics"
    },
    { 
      id: 3, 
      title: "Highest Gaming Score", 
      value: "999,999", 
      athlete: "Nova_One", 
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80",
      cat: "Gaming"
    },
    { 
      id: 4, 
      title: "Most Three-Pointers", 
      value: "105 Shots", 
      athlete: "Stephen Curry", 
      img: "https://images.unsplash.com/photo-1518611012118-2960c8badce4?auto=format&fit=crop&w=600&q=80",
      cat: "Athletics"
    },
    { 
      id: 5, 
      title: "Longest Plank Hold", 
      value: "9H 30M", 
      athlete: "Daniel Scali", 
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80",
      cat: "Endurance"
    },
    { 
      id: 6, 
      title: "Blindfolded Cube Solve", 
      value: "12.1 S", 
      athlete: "Jack Cai", 
      img: "https://images.unsplash.com/photo-1591123720164-de1348028a82?auto=format&fit=crop&w=600&q=80",
      cat: "Skills"
    }
  ];

  const filteredRecords = activeCategory === "All" 
    ? records 
    : records.filter(r => r.cat === activeCategory);

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingTop: "140px", display: "flex", flexDirection: "column" }}>
        
        {/* NAVBAR */}
        <Navbar />

        {/* HEADER */}
        <header style={{ padding: "40px 5% 40px", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ color: "#FF6A00", fontWeight: "800", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "20px" }}>
            GLOBAL ARCHIVE
          </div>
          <h1 style={{ 
            fontSize: "clamp(48px, 6vw, 90px)", 
            fontWeight: "950", 
            textTransform: "uppercase", 
            letterSpacing: "-0.04em", 
            marginBottom: "32px"
          }}>
            <ScrollReveal>EXPLORE RECORDS</ScrollReveal>
          </h1>
          
          {/* SEARCH & FILTERS */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap", marginBottom: "60px" }}>
            <div style={{ position: "relative", flex: 1, minWidth: "300px" }}>
              <Search size={18} style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }} />
              <input 
                type="text" 
                placeholder="Search by athlete, record or category..." 
                style={{ width: "100%", background: "#161616", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "100px", padding: "16px 20px 16px 50px", color: "white", fontSize: "14px", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setActiveCategory(c)}
                  style={{ 
                    padding: "10px 20px", 
                    borderRadius: "100px", 
                    background: activeCategory === c ? "#FF6A00" : "rgba(255,255,255,0.05)", 
                    color: activeCategory === c ? "white" : "rgba(255,255,255,0.5)", 
                    border: "none", 
                    fontSize: "12px", 
                    fontWeight: "800", 
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* RECORDS GRID */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "32px" }}>
            {filteredRecords.map((rec) => (
              <div key={rec.id} style={{ background: "#161616", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.03)", transition: "all 0.3s ease" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.borderColor = "rgba(255, 106, 0, 0.2)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.03)"; }}>
                <div style={{ position: "relative", height: "240px" }}>
                  <img src={rec.img} alt={rec.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", top: "16px", left: "16px", background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>
                    {rec.cat}
                  </div>
                </div>
                <div style={{ padding: "24px" }}>
                  <div style={{ fontSize: "24px", fontWeight: "950", color: "#FF6A00", marginBottom: "4px" }}>{rec.value}</div>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "8px", textTransform: "uppercase" }}>{rec.title}</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "20px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "900" }}>{rec.athlete[0]}</div>
                      <span style={{ fontSize: "14px", fontWeight: "700", color: "rgba(255,255,255,0.6)" }}>{rec.athlete}</span>
                    </div>
                    <Link to={`/record/${rec.id}`} style={{ textDecoration: "none", color: "#FF6A00", fontWeight: "800", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
                      DETAILS <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINATION / LOAD MORE */}
          <div style={{ textAlign: "center", marginTop: "80px" }}>
            <button 
              className="load-more-btn"
              onClick={(e) => {
                const btn = e.currentTarget;
                const originalText = btn.innerText;
                btn.innerText = "LOADING...";
                btn.style.opacity = "0.7";
                btn.style.pointerEvents = "none";
                
                setTimeout(() => {
                  btn.innerText = originalText;
                  btn.style.opacity = "1";
                  btn.style.pointerEvents = "auto";
                }, 1500);
              }}
              style={{ 
                background: "transparent", 
                border: "1px solid rgba(255,255,255,0.1)", 
                color: "white", 
                padding: "16px 48px", 
                borderRadius: "100px", 
                fontSize: "14px", 
                fontWeight: "900", 
                textTransform: "uppercase", 
                cursor: "pointer", 
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                outline: "none"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#FF6A00";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "#FF6A00";
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,106,0,0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "white";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.95)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
            >
              Load More Records
            </button>
          </div>
        </header>

        {/* FOOTER */}
        <Footer />

      </div>
    </PageTransition>
  );
};

export default Explore;
