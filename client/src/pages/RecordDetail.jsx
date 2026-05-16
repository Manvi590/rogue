import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, Calendar, MapPin, User, ShieldCheck, Share2, Play } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const RecordDetail = () => {
  const { id } = useParams();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mock data - in a real app, you'd fetch this based on the ID
  const record = {
    id: id || 1,
    title: id === "1" ? "Heaviest Deadlift Attempt" : id === "2" ? "Fastest 100m Sprint" : "World Record Achievement",
    value: id === "1" ? "501 KG" : id === "2" ? "9.58 S" : "Verified",
    athlete: id === "1" ? "Thor Bjornsson" : id === "2" ? "Usain Bolt" : "Elite Athlete",
    date: "May 02, 2024",
    location: "Reykjavik, Iceland",
    cat: id === "1" ? "Strength" : id === "2" ? "Athletics" : "General",
    img: id === "1" 
      ? "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1200&q=80" 
      : "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    desc: "This record represents the absolute peak of human physical potential. Verified through our multi-stage AI biometric analysis protocol, every millisecond and gram was accounted for in a sanctioned environment."
  };

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* HERO SECTION */}
        <section style={{ position: "relative", height: "70vh", minHeight: "500px", overflow: "hidden" }}>
          <img src={record.img} alt={record.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(10,10,10,0.4) 0%, #0A0A0A 100%)" }} />
          
          <div style={{ position: "absolute", bottom: "60px", left: "5%", right: "5%", maxWidth: "1400px", margin: "0 auto" }}>
            <Link to="/explore" style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FF6A00", textDecoration: "none", fontSize: "14px", fontWeight: "800", marginBottom: "32px", textTransform: "uppercase" }}>
              <ArrowLeft size={16} /> BACK TO ARCHIVE
            </Link>
            
            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
              <span style={{ background: "#FF6A00", color: "white", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>{record.cat}</span>
              <span style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)", color: "white", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>OFFICIALLY VERIFIED</span>
            </div>

            <h1 style={{ fontSize: "clamp(40px, 6vw, 80px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "1.0", marginBottom: "24px" }}>
              <ScrollReveal>{record.title}</ScrollReveal>
            </h1>

            <div style={{ display: "flex", alignItems: "center", gap: "40px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "900" }}>{record.athlete[0]}</div>
                <div>
                  <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "800" }}>ATHLETE</div>
                  <div style={{ fontSize: "18px", fontWeight: "900" }}>{record.athlete}</div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "800" }}>RECORD VALUE</div>
                <div style={{ fontSize: "32px", fontWeight: "950", color: "#FF6A00" }}>{record.value}</div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT GRID */}
        <section style={{ padding: "80px 5%", maxWidth: "1400px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "60px" }}>
          
          {/* LEFT: DETAILS & VIDEO */}
          <div>
            <div style={{ background: "#161616", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", padding: "48px", marginBottom: "40px" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px" }}>RECORD STORY</h2>
              <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.6)", lineHeight: "1.8", marginBottom: "40px" }}>
                {record.desc}
              </p>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <Calendar size={24} color="#FF6A00" />
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "800" }}>DATE ACHIEVED</div>
                    <div style={{ fontSize: "16px", fontWeight: "800" }}>{record.date}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <MapPin size={24} color="#FF6A00" />
                  <div>
                    <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "800" }}>LOCATION</div>
                    <div style={{ fontSize: "16px", fontWeight: "800" }}>{record.location}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* VIDEO PLACEHOLDER */}
            <div style={{ position: "relative", borderRadius: "32px", overflow: "hidden", aspectRatio: "16/9", background: "#111", border: "1px solid rgba(255,255,255,0.05)" }}>
              <img src={record.img} alt="Video Thumbnail" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.3 }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#FF6A00", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 0 40px rgba(255,106,0,0.4)" }}>
                  <Play fill="white" size={32} />
                </div>
                <span style={{ marginTop: "20px", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em" }}>WATCH ATTEMPT FOOTAGE</span>
              </div>
            </div>
          </div>

          {/* RIGHT: VERIFICATION & STATS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* VERIFICATION CARD */}
            <div style={{ background: "linear-gradient(135deg, #FF6A00, #FF3D00)", borderRadius: "32px", padding: "40px", color: "white" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <ShieldCheck size={32} />
                <h3 style={{ fontSize: "20px", fontWeight: "950", textTransform: "uppercase" }}>ROGUE VERIFIED</h3>
              </div>
              <p style={{ fontSize: "14px", fontWeight: "600", lineHeight: "1.6", opacity: 0.9, marginBottom: "32px" }}>
                This record has passed the Rogue World Records multi-stage verification protocol, including AI biometric analysis and environment validation.
              </p>
              <div style={{ background: "rgba(0,0,0,0.1)", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontSize: "11px", fontWeight: "900", opacity: 0.7, marginBottom: "12px" }}>VERIFICATION ID</div>
                <div style={{ fontSize: "16px", fontWeight: "900", letterSpacing: "0.1em" }}>RWR-992384-ELITE</div>
              </div>
            </div>

            {/* PERFORMANCE METRICS */}
            <div style={{ background: "#161616", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.05)", padding: "40px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px", color: "rgba(255,255,255,0.4)" }}>PERFORMANCE METRICS</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {[
                  { label: "Heart Rate (Peak)", val: "182 BPM" },
                  { label: "Execution Time", val: record.value },
                  { label: "Adjudication Score", val: "9.8/10" }
                ].map((m, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "12px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "rgba(255,255,255,0.4)" }}>{m.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: "900" }}>{m.val}</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default RecordDetail;
