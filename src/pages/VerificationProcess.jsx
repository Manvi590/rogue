import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  UserCheck, 
  Settings, 
  Video, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Zap,
  Globe,
  Lock,
  Search,
  Trophy
} from "lucide-react";
import { motion } from "framer-motion";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const VerificationProcess = () => {
  const steps = [
    {
      num: "01",
      title: "Identity Audit",
      desc: "Every record starts with a verified athlete profile. Our Biometric Audit Engine links your physical signature to your digital identity with 99.9% accuracy.",
      icon: <UserCheck size={32} />,
      tag: "PHASE_01"
    },
    {
      num: "02",
      title: "Achievement Definition",
      desc: "Select your discipline from our global database of 200+ categories. We calibrate the specific metrics and standards required for your tier.",
      icon: <Settings size={32} />,
      tag: "PHASE_02"
    },
    {
      num: "03",
      title: "Environment Validation",
      desc: "Record your attempt in a sanctioned venue with verified witnesses. Our GPS and spatial analysis tools confirm the integrity of the performance space.",
      icon: <Globe size={32} />,
      tag: "PHASE_03"
    },
    {
      num: "04",
      title: "UHD Media Evidence",
      desc: "Upload uncut 4K/1080P footage of your attempt. Our system scans for frame integrity and metadata anomalies to prevent digital manipulation.",
      icon: <Video size={32} />,
      tag: "PHASE_04"
    },
    {
      num: "05",
      title: "AI Biometric Analysis",
      desc: "Our neural networks parse 420 joint positions per second, comparing your movement signature against global elite standards for that record.",
      icon: <Activity size={32} />,
      tag: "PHASE_05"
    },
    {
      num: "06",
      title: "Global Ledger Indexing",
      desc: "Once verified, your record is cryptographically signed and added to the Rogue World Ledger. Your digital and physical certificates are dispatched.",
      icon: <Trophy size={32} />,
      tag: "PHASE_06"
    }
  ];

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* HERO SECTION */}
        <section style={{ position: "relative", padding: "100px 5% 60px", overflow: "hidden" }}>
          {/* Background Elements */}
          <div style={{ position: "absolute", top: 0, right: 0, width: "1000px", height: "1000px", background: "radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%)", zIndex: 0 }} />
          
          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <Shield size={20} color="#FF6A00" />
                <span style={{ fontSize: "14px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.2em", textTransform: "uppercase" }}>THE GOLD STANDARD</span>
              </div>
              <h1 style={{ fontSize: "clamp(32px, 5.5vw, 64px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "1", marginBottom: "32px", color: "white" }}>
                VERIFICATION PROTOCOL
              </h1>
              <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)", maxWidth: "600px", lineHeight: "1.6", marginBottom: "48px" }}>
                Integrity is the foundation of ROGUE. Our multi-stage verification process ensures that every world record is absolute, authentic, and indisputable.
              </p>
              
              <Link to="/verify" style={{ textDecoration: "none" }}>
                <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "20px 48px", fontSize: "15px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 20px 40px rgba(255,106,0,0.2)" }}>
                  START SUBMISSION <ArrowRight size={20} />
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* PROCESS GRID */}
        <section style={{ padding: "100px 5%", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "32px" }}>
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  border: "1px solid rgba(255,255,255,0.05)", 
                  borderRadius: "32px", 
                  padding: "48px",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", right: "-20px", top: "-20px", fontSize: "120px", fontWeight: "950", color: "rgba(255,255,255,0.02)", userSelect: "none" }}>{step.num}</div>
                
                <div style={{ color: "#FF6A00", marginBottom: "24px", position: "relative", zIndex: 2 }}>{step.icon}</div>
                
                <div style={{ marginBottom: "16px", position: "relative", zIndex: 2 }}>
                  <div style={{ fontSize: "11px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: "8px" }}>{step.tag}</div>
                  <h3 style={{ fontSize: "28px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.01em" }}>{step.title}</h3>
                </div>
                
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", lineHeight: "1.7", position: "relative", zIndex: 2 }}>
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* TECH STACK SECTION */}
        <section style={{ padding: "100px 5%", maxWidth: "1200px", margin: "0 auto" }}>
           <div style={{ background: "linear-gradient(to right, #111, #0A0A0A)", borderRadius: "48px", border: "1px solid rgba(255,255,255,0.05)", padding: "80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
              <div>
                <h2 style={{ fontSize: "48px", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px", letterSpacing: "-0.02em" }}>POWERED BY <br /> <span style={{ color: "#FF6A00" }}>ROGUE AI VISION</span></h2>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "32px" }}>
                  Our proprietary AI Vision technology analyzes over 400 data points per second to ensure every rep, every second, and every gram is accounted for.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    { icon: <Lock size={18} />, label: "CRYPTOGRAPHIC PROOF" },
                    { icon: <Search size={18} />, label: "NEURAL FRAME ANALYSIS" },
                    { icon: <Zap size={18} />, label: "REAL-TIME SYNC" }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                       <div style={{ color: "#FF6A00" }}>{item.icon}</div>
                       <span style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "0.1em" }}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "relative" }}>
                 <div style={{ width: "100%", height: "400px", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,106,0,0.2)" }}>
                    <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80" alt="Tech" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(255,106,0,0.1)", mixBlendMode: "overlay" }} />
                 </div>
                 <div style={{ position: "absolute", bottom: "-20px", right: "-20px", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.1)", padding: "24px", borderRadius: "24px", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
                    <div style={{ fontSize: "10px", fontWeight: "900", color: "#FF6A00", marginBottom: "4px" }}>SYSTEM STATUS</div>
                    <div style={{ fontSize: "20px", fontWeight: "950" }}>OPERATIONAL</div>
                 </div>
              </div>
           </div>
        </section>

        {/* ══════════════════ IMPROVED CTA SECTION ══════════════════ */}
        <section style={{ padding: "100px 5% 160px", position: "relative", overflow: "hidden" }}>
          <div className="orange-cta" style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 40px", borderRadius: "40px" }}>
            {/* Dynamic backgrounds */}
            <div className="orange-cta-bg" />
            <div className="orange-cta-grid" />
            <div className="orange-cta-glow" />

            <div className="orange-cta-content" style={{ textAlign: "center" }}>
              <span className="orange-cta-badge" style={{ marginBottom: "24px" }}>Take the Leap</span>
              <h2 className="orange-cta-title" style={{ fontSize: "64px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "-0.03em" }}>
                READY TO <span className="orange-cta-highlight">SUBMIT?</span>
              </h2>
              <p className="orange-cta-subtitle" style={{ maxWidth: "500px", margin: "0 auto 40px", fontSize: "18px", color: "rgba(255,255,255,0.8)" }}>
                Start your journey towards global recognition. Our team is ready to verify your achievement.
              </p>
              
              <div style={{ display: "flex", gap: "20px", justifyContent: "center", position: "relative", zIndex: 5 }}>
                <Link to="/verify" style={{ textDecoration: "none" }}>
                  <button style={{ 
                    background: "#FFFFFF", 
                    color: "#FF6A00", 
                    border: "none", 
                    borderRadius: "100px", 
                    padding: "20px 48px", 
                    fontSize: "15px", 
                    fontWeight: "900", 
                    textTransform: "uppercase", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "12px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease"
                  }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.background = "#f0f0f0";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.background = "#FFFFFF";
                    }}
                  >
                    OPEN APPLICATION <ArrowRight size={20} />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default VerificationProcess;
