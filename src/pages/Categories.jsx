import React from "react";
import { Link } from "react-router-dom";
import { Activity, Dumbbell, Timer, Target, Trophy, Gamepad2, Waves, Zap, Brain, ArrowRight, ChevronRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Categories = () => {
  const allCategories = [
    { name: "Athletics", icon: <Activity />, count: "142 Records", desc: "Classic track and field events. Speed, agility, and pure athleticism." },
    { name: "Strength", icon: <Dumbbell />, count: "89 Records", desc: "Lift more than anyone on the planet. Pure power, zero excuses." },
    { name: "Endurance", icon: <Timer />, count: "64 Records", desc: "Go the distance. Push the absolute limits of human stamina." },
    { name: "Balance", icon: <Target />, count: "32 Records", desc: "Steady hands and focus. Mastery of equilibrium in any situation." },
    { name: "Skills", icon: <Trophy />, count: "112 Records", desc: "Precision, technique, mastery. Show the world what you can do." },
    { name: "Gaming", icon: <Gamepad2 />, count: "256 Records", desc: "From speedruns to high scores. Digital dominance, verified." },
    { name: "Water Sports", icon: <Waves />, count: "45 Records", desc: "Dominate the waves. Swimming, surfing, and aquatic achievements." },
    { name: "Reaction", icon: <Zap />, count: "78 Records", desc: "Fastest on two feet or four wheels. Every millisecond counts." },
    { name: "Mind & Memory", icon: <Brain />, count: "39 Records", desc: "Cognitive greatness. Rubik's cubes, memory feats, and logic." },
    { name: "Action Sports", icon: <Activity />, count: "92 Records", desc: "X-Games style adrenaline. Skating, BMX, and extreme feats." }
  ];

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "180px 5% 120px", maxWidth: "1400px", margin: "0 auto", flex: 1 }}>
          
          <header style={{ textAlign: "left", marginBottom: "60px" }}>
            <div style={{ color: "#FF6A00", fontWeight: "800", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "16px" }}>
              DISCOVER YOUR NICHE
            </div>
            <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: "950", textTransform: "uppercase", color: "white", letterSpacing: "-0.02em" }}>
              ALL RECORD CATEGORIES
            </h1>
          </header>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "24px" }}>
            {allCategories.map((cat, idx) => (
              <Link key={idx} to="/explore" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ background: "#161616", borderRadius: "32px", padding: "40px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden", transition: "all 0.3s ease" }} onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.borderColor = "#FF6A00"; }} onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"; }}>
                  <div style={{ position: "absolute", top: "-20px", right: "-20px", color: "rgba(255,106,0,0.05)", fontSize: "120px", opacity: 0.5 }}>
                    {cat.icon}
                  </div>

                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ background: "rgba(255,106,0,0.1)", color: "#FF6A00", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
                      {React.cloneElement(cat.icon, { size: 28 })}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                      <h2 style={{ fontSize: "24px", fontWeight: "900", textTransform: "uppercase" }}>{cat.name}</h2>
                      <span style={{ fontSize: "12px", fontWeight: "800", color: "#FF6A00", background: "rgba(255,106,0,0.1)", padding: "4px 12px", borderRadius: "100px" }}>{cat.count}</span>
                    </div>
                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6", marginBottom: "32px", maxWidth: "280px" }}>{cat.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase" }}>
                      EXPLORE NOW <ArrowRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Categories;
