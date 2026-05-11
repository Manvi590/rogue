import React from "react";
import { ArrowRight, Camera, ShieldCheck, Zap, Quote, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import GlowCard from "../components/GlowCard";

const About = () => {
  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
        
        {/* NAVBAR */}
        <Navbar />

        {/* HERO SECTION */}
        <header style={{ position: "relative", height: "90vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", paddingTop: "80px" }}>
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80" 
            alt="Athlete Lifting" 
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, filter: "grayscale(100%) brightness(0.7)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, #0A0A0A)" }} />
          
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", width: "90%", maxWidth: "1000px" }}>
            <div style={{ color: "#FF6A00", fontWeight: "800", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.4em", marginBottom: "20px" }}>
              ESTABLISHED 2024
            </div>
            <h1 style={{ fontSize: "clamp(48px, 10vw, 120px)", fontWeight: "950", lineHeight: "0.9", textTransform: "uppercase", letterSpacing: "-0.04em", marginBottom: "24px" }}>
              <ScrollReveal>DEFINING THE</ScrollReveal> <br />
              <span style={{ color: "#FF6A00" }}><ScrollReveal>UNBREAKABLE</ScrollReveal></span>
            </h1>
            <div style={{ width: "80px", height: "4px", background: "#FF6A00", margin: "0 auto" }}></div>
          </div>
        </header>

        {/* MISSION & VISION */}
        <main style={{ padding: "180px 5% 120px", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "40px", alignItems: "stretch" }}>
            <div style={{ textAlign: "left", background: "rgba(255,255,255,0.02)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h2 style={{ fontSize: "40px", fontWeight: "900", textTransform: "uppercase", marginBottom: "24px", color: "white" }}>
                OUR <span style={{ color: "#FF6A00" }}>MISSION</span>
              </h2>
              <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", maxWidth: "500px" }}>
                To curate, verify, and immortalize the most extreme human physical achievements. We don't just record data; we capture the narrative of human limits being shattered under pressure.
              </p>
            </div>
            <div style={{ textAlign: "left", background: "rgba(255,255,255,0.02)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)" }}>
              <h2 style={{ fontSize: "40px", fontWeight: "900", textTransform: "uppercase", marginBottom: "24px", color: "white" }}>
                OUR <span style={{ color: "#FF6A00" }}>VISION</span>
              </h2>
              <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", maxWidth: "500px" }}>
                To become the global gold standard for athletic prestige. A world where "Rogue Verified" is the ultimate mark of physical dominance and uncompromising discipline.
              </p>
            </div>
          </div>
        </section>

        {/* VERIFICATION STANDARD */}
        <section style={{ padding: "100px 5%", background: "#0F0F0F" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ marginBottom: "60px" }}>
              <h2 style={{ fontSize: "56px", fontWeight: "950", textTransform: "uppercase", marginBottom: "8px", color: "white" }}>
                THE VERIFICATION STANDARD
              </h2>
              <p style={{ color: "#FF6A00", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "12px" }}>
                NO SHORTCUTS. NO EXCUSES.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px" }}>
              {[
                { 
                  icon: <Camera size={24} />, 
                  title: "MULTI-ANGLE LOGGING", 
                  desc: "Every attempt requires synchronized footage from three distinct vantage angles to ensure absolute technical measurement." 
                },
                { 
                  icon: <Zap size={24} />, 
                  title: "CALIBRATED GEAR", 
                  desc: "All equipment must be certified and weighed on-camera using industry-standard digital scales prior to the official attempt." 
                },
                { 
                  icon: <ShieldCheck size={24} />, 
                  title: "ELITE ADJUDICATION", 
                  desc: "Records are reviewed by a panel of three former professional athletes and technical specialists before being added to the ledger." 
                }
              ].map((item, idx) => (
                <GlowCard key={idx} glowColor="orange" className="about-glow-card">
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ background: "#FF6A00", color: "white", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "32px" }}>
                      {item.icon}
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "16px", textTransform: "uppercase" }}>{item.title}</h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>{item.desc}</p>
                  </div>
                </GlowCard>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIAL / QUOTE */}
        <section style={{ padding: "140px 5%", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ background: "#161616", padding: "80px", borderRadius: "40px", display: "flex", alignItems: "center", gap: "60px", flexWrap: "wrap", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80" 
                alt="Founder" 
                style={{ width: "220px", height: "220px", borderRadius: "50%", border: "4px solid #FF6A00", objectFit: "cover" }}
              />
              <div style={{ position: "absolute", bottom: "10px", right: "10px", background: "#FF6A00", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Quote size={20} fill="white" />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <Quote size={40} style={{ color: "#FF6A00", opacity: 0.2, marginBottom: "20px" }} />
              <h3 style={{ fontSize: "28px", fontWeight: "800", lineHeight: "1.3", marginBottom: "24px", textTransform: "uppercase" }}>
                "WE DIDN'T BUILD THIS FOR THE CASUAL ENTHUSIAST. WE BUILT IT FOR THE OBSESSIVES WHO WAKE UP WHEN THE WORLD IS STILL ASLEEP."
              </h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "32px" }}>
                ROGUE was born from a frustration with soft standards. It needed a place where the numbers were undeniable and the athletes were icons. This is that place.
              </p>
              <div>
                <div style={{ fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", fontSize: "14px" }}>MARCUS VANCE</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em" }}>FOUNDER & HEAD ADJUDICATOR</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ IMPROVED CTA SECTION ══════════════════ */}
        <section style={{ padding: "120px 5% 160px", position: "relative", overflow: "hidden" }}>
          <div className="orange-cta" style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 40px", borderRadius: "40px" }}>
            {/* Dynamic backgrounds */}
            <div className="orange-cta-bg" />
            <div className="orange-cta-grid" />
            <div className="orange-cta-glow" />

            <div className="orange-cta-content" style={{ textAlign: "center" }}>
              <span className="orange-cta-badge" style={{ marginBottom: "24px" }}>Elevate Your Status</span>
              <h2 className="orange-cta-title" style={{ fontSize: "clamp(48px, 8vw, 90px)", marginBottom: "40px" }}>
                WANT TO GO <span className="orange-cta-highlight">ROGUE?</span>
              </h2>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", position: "relative", zIndex: 5 }}>
                <Link to="/elite" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    background: "#FFFFFF", 
                    color: "#FF6A00", 
                    padding: "18px 40px", 
                    borderRadius: "100px", 
                    fontWeight: "900", 
                    textTransform: "uppercase", 
                    fontSize: "14px", 
                    border: "none", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "10px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease"
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 30px 60px rgba(0,0,0,0.3)";
                      e.currentTarget.style.background = "#f0f0f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.2)";
                      e.currentTarget.style.background = "#FFFFFF";
                    }}
                  >
                    APPLY FOR MEMBERSHIP <ArrowRight size={18} />
                  </button>
                </Link>
                <Link to="/rules" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    background: "#FFFFFF", 
                    color: "#FF6A00", 
                    padding: "18px 40px", 
                    borderRadius: "100px", 
                    fontWeight: "900", 
                    textTransform: "uppercase", 
                    fontSize: "14px", 
                    border: "1px solid #FFFFFF", 
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease"
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f0f0f0";
                      e.currentTarget.style.borderColor = "#f0f0f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#FFFFFF";
                      e.currentTarget.style.borderColor = "#FFFFFF";
                    }}
                  >
                    VIEW THE RULES <ChevronRight size={18} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />

      </div>
    </PageTransition>
  );
};

export default About;
