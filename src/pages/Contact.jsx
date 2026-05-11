import React from "react";
import { ArrowRight, Shield, User, MessageSquare } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Contact = () => {
  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh" }}>
        
        {/* NAVBAR */}
        <Navbar />

        {/* MAIN CONTENT */}
        <main style={{ padding: "180px 5% 120px", maxWidth: "1400px", margin: "0 auto" }}>
          
          {/* HERO SECTION */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "60px", marginBottom: "100px", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <div style={{ color: "#FF6A00", fontWeight: "800", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "20px" }}>
                PREMIUM SUPPORT
              </div>
              <h1 style={{ fontSize: "clamp(48px, 6vw, 90px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.95", marginBottom: "32px" }}>
                <ScrollReveal>CONTACT THE</ScrollReveal> <br />
                <span style={{ color: "#FF6A00" }}><ScrollReveal>ELITE COMMAND</ScrollReveal></span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", lineHeight: "1.6", maxWidth: "550px" }}>
                Whether you are challenging a global benchmark or inquiring about high-performance membership, our team provides uncompromising assistance to the world's most dedicated athletes.
              </p>
            </div>

            {/* RESPONSE TIME BOX */}
            <div style={{ background: "#161616", padding: "40px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", width: "320px", position: "relative", overflow: "hidden" }}>
              <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
                RESPONSE TIME
              </div>
              <div style={{ fontSize: "64px", fontWeight: "950", color: "white", lineHeight: "1" }}>
                2.4 <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>HOURS</span>
              </div>
              <div style={{ marginTop: "24px", width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                <div style={{ width: "70%", height: "100%", background: "#FF6A00", borderRadius: "2px", boxShadow: "0 0 10px #FF6A00" }}></div>
              </div>
            </div>
          </div>

          {/* QUICK ACCESS & FORM */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "60px", alignItems: "start" }}>
            
            {/* QUICK ACCESS */}
            <div>
              <h2 style={{ fontSize: "32px", fontWeight: "900", textTransform: "uppercase", marginBottom: "40px" }}>QUICK ACCESS</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { icon: <Shield size={20} />, title: "RECORD SUBMISSION", desc: "Guidelines for official attempts" },
                  { icon: <User size={20} />, title: "MEMBERSHIP TIER", desc: "Elite athlete perks and billing" },
                  { icon: <MessageSquare size={20} />, title: "PRESS & MEDIA", desc: "Official statements and branding" }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: "#161616", padding: "24px 32px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.03)", display: "flex", alignItems: "center", gap: "24px", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ color: "#FF6A00" }}>{item.icon}</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: "800", textTransform: "uppercase" }}>{item.title}</div>
                      <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTACT FORM */}
            <div style={{ background: "#161616", padding: "60px", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <form style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>FULL NAME</label>
                    <input type="text" placeholder="ATHLETE NAME" style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px 20px", color: "white", outline: "none" }} />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>EMAIL ADDRESS</label>
                    <input type="email" placeholder="ATHLETE@DOMAIN.COM" style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px 20px", color: "white", outline: "none" }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>SUBJECT</label>
                  <select style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px 20px", color: "white", outline: "none", appearance: "none" }}>
                    <option>GENERAL INQUIRY</option>
                    <option>RECORD CHALLENGE</option>
                    <option>MEMBERSHIP</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>MESSAGE</label>
                  <textarea placeholder="DESCRIBE YOUR INQUIRY WITH PRECISION..." rows="5" style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px 20px", color: "white", outline: "none", resize: "none" }}></textarea>
                </div>
                <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "20px 40px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", transition: "all 0.3s ease", boxShadow: "0 10px 30px rgba(255, 106, 0, 0.2)" }}>
                  SEND TRANSMISSION <ArrowRight size={18} />
                </button>
              </form>
            </div>

          </div>
        </main>

        {/* FOOTER */}
        <Footer />

      </div>
    </PageTransition>
  );
};

export default Contact;
