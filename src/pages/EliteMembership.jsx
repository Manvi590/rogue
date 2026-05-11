import React from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck, Zap, Crown, ArrowRight, Check } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const EliteMembership = () => {
  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        <div style={{ padding: "60px 5% 120px", maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px", lineHeight: "1" }}>
            ROGUE <span style={{ color: "#FF6A00" }}>ELITE</span>
          </h1>
          <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)", maxWidth: "700px", margin: "0 auto 80px", lineHeight: "1.6" }}>
            Join the inner circle of the world's most disciplined athletes. Unlock exclusive benefits, priority verification, and limited gear access.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "32px", textAlign: "left" }}>
            
            {/* STANDARD (FREE) */}
            <div style={{ background: "#161616", borderRadius: "32px", padding: "48px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "14px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>LEVEL 1</div>
              <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "32px" }}>CHALLENGER</h2>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "48px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "center", color: "rgba(255,255,255,0.6)" }}><Check size={18} color="#FF6A00" /> Basic Record Submission</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center", color: "rgba(255,255,255,0.6)" }}><Check size={18} color="#FF6A00" /> Community Chat Access</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center", color: "rgba(255,255,255,0.6)" }}><Check size={18} color="#FF6A00" /> Digital Badges</li>
              </ul>
              <button style={{ width: "100%", background: "rgba(255,255,255,0.05)", color: "white", border: "none", borderRadius: "100px", padding: "18px", fontSize: "14px", fontWeight: "900", cursor: "pointer" }}>CURRENT PLAN</button>
            </div>

            {/* ELITE (PAID) */}
            <div style={{ background: "#1A1410", borderRadius: "32px", padding: "48px", border: "2px solid #FF6A00", position: "relative", transform: "scale(1.05)" }}>
              <div style={{ position: "absolute", top: "-15px", right: "40px", background: "#FF6A00", color: "white", padding: "4px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "900" }}>MOST POPULAR</div>
              <div style={{ fontSize: "14px", fontWeight: "900", color: "#FF6A00", marginBottom: "8px" }}>LEVEL 2</div>
              <h2 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "8px" }}>ELITE</h2>
              <div style={{ fontSize: "24px", fontWeight: "900", marginBottom: "32px" }}>$19.99 <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>/ MONTH</span></div>
              <ul style={{ listStyle: "none", padding: 0, marginBottom: "48px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <li style={{ display: "flex", gap: "12px", alignItems: "center" }}><Crown size={18} color="#FF6A00" /> Priority 24h Verification</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center" }}><Star size={18} color="#FF6A00" /> 20% Off All Official Gear</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center" }}><ShieldCheck size={18} color="#FF6A00" /> Verified Gold Checkmark</li>
                <li style={{ display: "flex", gap: "12px", alignItems: "center" }}><Zap size={18} color="#FF6A00" /> Exclusive Leaderboards</li>
              </ul>
              <button style={{ width: "100%", background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,106,0,0.4)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                UPGRADE NOW <ArrowRight size={18} />
              </button>
            </div>

          </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default EliteMembership;
