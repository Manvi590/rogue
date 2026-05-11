import React from "react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Eye, 
  Lock, 
  UserCircle, 
  ArrowRight, 
  Download, 
  Trash2, 
  Search,
  CheckCircle,
  Activity,
  Database
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Privacy = () => {
  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column", paddingTop: "80px" }}>
        
        {/* NAVBAR */}
        <Navbar />

        <div style={{ padding: "60px 5% 120px", flex: 1 }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "80px", maxWidth: "1200px", margin: "0 auto 80px" }}>
          <div>
            <h3 style={{ color: "#FF6A00", fontSize: "11px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "12px", textTransform: "uppercase" }}>LEGAL CENTER</h3>
            <h1 style={{ fontSize: "120px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.8" }}>
              <ScrollReveal>PRIVACY POLICY</ScrollReveal>
            </h1>
          </div>
          <div style={{ position: "relative", width: "400px" }}>
            <Search style={{ position: "absolute", left: "20px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)" }} size={18} />
            <input 
              type="text" 
              placeholder="SEARCH POLICY" 
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "100px", padding: "16px 20px 16px 54px", color: "white", fontSize: "13px", fontWeight: "700", outline: "none" }}
            />
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
          
          {/* 01 DATA COLLECTION */}
          <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "48px" }}>
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
               <div style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.1em" }}>01 / DATA SCOPE</div>
               <Shield size={24} color="#FF6A00" opacity={0.5} />
             </div>
             <h2 style={{ fontSize: "36px", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px" }}>DATA COLLECTION</h2>
             <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", marginBottom: "40px" }}>
               We collect essential biometric data including heart rate, velocity profiles, and power output to ensure record authenticity. Location data is tracked via GPS for outdoor distance-based records.
             </p>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
               <div style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                 <div style={{ fontSize: "12px", fontWeight: "900", marginBottom: "12px" }}>BIOMETRIC DATA</div>
                 <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>Heart rate variability, cadence, and force production metrics.</p>
               </div>
               <div style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }}>
                 <div style={{ fontSize: "12px", fontWeight: "900", marginBottom: "12px" }}>VIDEO EVIDENCE</div>
                 <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6" }}>High-frame-rate submissions for frame-by-frame analysis.</p>
               </div>
             </div>
          </div>

          {/* 02 MISSION */}
          <div style={{ background: "#FF6A00", borderRadius: "32px", padding: "48px", color: "white" }}>
            <div style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "32px", opacity: 0.8 }}>02 / MISSION</div>
            <h2 style={{ fontSize: "36px", fontWeight: "950", textTransform: "uppercase", marginBottom: "40px", lineHeight: "1.1" }}>HOW WE <br /> USE DATA</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              {[
                { icon: <CheckCircle size={18} />, text: "Global verification of record attempts." },
                { icon: <Activity size={18} />, text: "Dynamic ranking on elite leaderboards." },
                { icon: <Shield size={18} />, text: "Anti-fraud and performance integrity." }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                  <div style={{ marginTop: "2px" }}>{item.icon}</div>
                  <p style={{ fontSize: "13px", fontWeight: "700", lineHeight: "1.4" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 03 ECOSYSTEM */}
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "48px" }}>
             <div style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "32px" }}>03 / ECOSYSTEM</div>
             <h2 style={{ fontSize: "36px", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px" }}>DATA SHARING</h2>
             <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", marginBottom: "40px" }}>
               We never sell personal biometric profiles. Sharing is limited to official adjudicators and authorized brand partners for certified world record attempts.
             </p>
             <div style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "20px", border: "1px solid rgba(255,106,0,0.1)", fontStyle: "italic", fontSize: "13px", color: "rgba(255,255,255,0.3)", textAlign: "center" }}>
               "Integrity is the bedrock of Rogue World Records. Your data is your power."
             </div>
          </div>

          {/* 04 GOVERNANCE */}
          <div style={{ gridColumn: "span 2", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "48px" }}>
             <div style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "32px" }}>04 / GOVERNANCE</div>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
               <div>
                 <h2 style={{ fontSize: "36px", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px" }}>USER RIGHTS</h2>
                 <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8" }}>
                   Full control over your athletic identity. Request deletion, export performance logs, or manage public visibility of your records at any time via the Elite Settings panel.
                 </p>
               </div>
               <div style={{ display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" }}>
                 <button style={{ width: "100%", background: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "16px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                   REQUEST EXPORT <Download size={16} />
                 </button>
                 <button style={{ width: "100%", background: "rgba(255,0,0,0.05)", color: "#FF4D4D", border: "1px solid rgba(255,0,0,0.1)", borderRadius: "100px", padding: "16px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                   DELETE ACCOUNT <Trash2 size={16} />
                 </button>
               </div>
             </div>
          </div>

        </div>

        {/* BOTTOM BANNER */}
        <div style={{ maxWidth: "1200px", margin: "60px auto 0", background: "rgba(255,106,0,0.1)", border: "1px solid rgba(255,106,0,0.2)", borderRadius: "32px", padding: "32px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
             <Database size={32} color="#FF6A00" />
             <div>
               <h4 style={{ fontSize: "20px", fontWeight: "950", textTransform: "uppercase", color: "white" }}>GDPR COMPLIANT</h4>
               <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontWeight: "600" }}>Global standards for elite data protection.</p>
             </div>
           </div>
           <button style={{ background: "#FFD7BE", color: "#000", border: "none", borderRadius: "100px", padding: "14px 32px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
             READ FULL STATUTES <ArrowRight size={16} />
           </button>
        </div>
        </div>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Privacy;
