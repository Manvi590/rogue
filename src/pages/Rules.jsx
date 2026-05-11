import React from "react";
import { Shield, CheckCircle2, AlertCircle, Info, ArrowRight, Gavel, FileText, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Rules = () => {
  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* Hero Section */}
        <header style={{ padding: "60px 5% 40px", textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,106,0,0.1)", color: "#FF6A00", padding: "8px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", marginBottom: "20px" }}>
            <Shield size={14} /> Official Guidelines
          </div>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: "950", textTransform: "uppercase", marginBottom: "0", lineHeight: "1", color: "white" }}>
            THE RULES OF <span style={{ color: "#FF6A00" }}>ENGAGEMENT</span>
          </h1>
        </header>

        {/* Rules Sections */}
        <section style={{ padding: "80px 5%", maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px" }}>
            
            {[
              {
                icon: <FileText size={32} />,
                title: "Pre-Attempt Registration",
                rules: [
                  "All attempts must be registered at least 48 hours in advance.",
                  "Specific category rules must be acknowledged in writing.",
                  "Equipment calibration logs must be submitted prior to the attempt."
                ]
              },
              {
                icon: <Gavel size={32} />,
                title: "Evidence Standards",
                rules: [
                  "Unedited, continuous video footage from three synchronized angles.",
                  "Audio must remain clear and unmanipulated throughout.",
                  "Date, time, and location verification must be visible in frame."
                ]
              },
              {
                icon: <Scale size={32} />,
                title: "Measurement Integrity",
                rules: [
                  "All scales and measuring devices must be industry-standard.",
                  "Measurement must be conducted by a verified third party or on-camera.",
                  "Zeroing and calibration must be demonstrated in the primary footage."
                ]
              }
            ].map((section, i) => (
              <div key={i} style={{ background: "#111", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ color: "#FF6A00", marginBottom: "24px" }}>{section.icon}</div>
                <h3 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "24px", textTransform: "uppercase" }}>{section.title}</h3>
                <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "16px" }}>
                  {section.rules.map((rule, idx) => (
                    <li key={idx} style={{ display: "flex", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>
                      <CheckCircle2 size={16} style={{ color: "#FF6A00", flexShrink: 0, marginTop: "2px" }} />
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>

          {/* Important Notice */}
          <div style={{ marginTop: "60px", background: "linear-gradient(to right, #1a1a1a, #111)", padding: "40px", borderRadius: "24px", border: "1px solid #FF6A00", display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ background: "rgba(255,106,0,0.1)", color: "#FF6A00", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <AlertCircle size={32} />
            </div>
            <div style={{ flex: 1, minWidth: "260px" }}>
              <h4 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "8px", textTransform: "uppercase" }}>Zero Tolerance Policy</h4>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: "1.6" }}>
                Any attempt to manipulate evidence, use banned substances, or provide false biometric data will result in a permanent ban from all Rogue World Records events and platforms.
              </p>
            </div>
            <Link to="/contact" style={{ textDecoration: "none" }}>
              <button style={{ background: "#FF6A00", color: "white", border: "none", padding: "16px 32px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                CONTACT ADJUDICATOR <ArrowRight size={18} />
              </button>
            </Link>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Rules;
