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
  }, [id]);

  // Dynamic slug mapping for nice and realistic record data
  const getRecordData = (slug) => {
    const defaultTitle = slug
      ? slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "World Record Achievement";

    const database = {
      "stair-climbing": {
        title: "Fastest 1,000 Step Stair Climb",
        value: "4 Min 32.5 Sec",
        athlete: "Marcus Vance",
        date: "April 18, 2024",
        location: "Chicago, IL, USA",
        cat: "Endurance",
        img: "https://images.unsplash.com/photo-1578762560072-0c69fe73444e?auto=format&fit=crop&w=1200&q=80",
        desc: "An incredible test of lower body stamina and cardiorespiratory limits. Marcus climbed a verified 1,000-step vertical stair tower at an average ascending heart rate of 188 BPM."
      },
      "sprinting": {
        title: "Fastest 100M Sprint",
        value: "9.58 Seconds",
        athlete: "Usain Bolt",
        date: "August 16, 2009",
        location: "Berlin, Germany",
        cat: "Athletics",
        img: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&w=1200&q=80",
        desc: "The legendary, historically verified sprinting world record demonstrating the absolute zenith of human velocity and physical acceleration."
      },
      "bench-press": {
        title: "Heaviest Raw Bench Press",
        value: "355 KG (782.6 LBS)",
        athlete: "Julius Maddox",
        date: "May 12, 2021",
        location: "Reykjavik, Iceland",
        cat: "Strength",
        img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
        desc: "An unmatched display of raw press power. Julius Maddox successfully pressed 355 kilograms completely raw, bypassing the use of lifting gear under strict powerlifting inspection."
      },
      "deadlifts": {
        title: "Heaviest Deadlift Attempt",
        value: "501 KG",
        athlete: "Thor Bjornsson",
        date: "May 02, 2020",
        location: "Reykjavik, Iceland",
        cat: "Strength",
        img: "https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1200&q=80",
        desc: "Thor Bjornsson raised 501 kilograms in a sanctioned lift at his gym, which was broadcast worldwide. A triumph of sheer power and athletic resolve."
      },
      "plank-holds": {
        title: "Longest Continuous Plank Hold",
        value: "9 Hrs 30 Min 01 Sec",
        athlete: "Daniel Scali",
        date: "August 06, 2023",
        location: "Adelaide, Australia",
        cat: "Endurance",
        img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80",
        desc: "Daniel Scali demonstrated extreme physical and mental resilience, battling CRPS (Complex Regional Pain Syndrome) to hold a verified abdominal plank position for over nine and a half hours."
      },
      "rubik-s-cube": {
        title: "Fastest 3x3x3 Rubik's Cube Solve",
        value: "3.13 Seconds",
        athlete: "Max Park",
        date: "June 11, 2023",
        location: "California, USA",
        cat: "Skills",
        img: "https://images.unsplash.com/photo-1591951425328-48c1fe7179cd?auto=format&fit=crop&w=1200&q=80",
        desc: "Max Park achieved the unthinkable by solving a standard 3x3x3 Rubik's Cube in 3.13 seconds under official WCA supervision, highlighting superior spatial intelligence and motor speeds."
      }
    };

    const key = slug ? slug.toLowerCase() : "";
    if (database[key]) {
      return { id: slug, ...database[key] };
    }

    return {
      id: slug || "rwr-general",
      title: defaultTitle,
      value: "Verified Record",
      athlete: "Alexander 'Apex' Thorne",
      date: "October 14, 2024",
      location: "Rogue Arena Hub",
      cat: "Verified Record",
      img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80",
      desc: "A verified Rogue World Record athletic performance. Fully scrutinized by our Biometric Audit Engine and verified by a specialized panel of international adjudicators."
    };
  };

  const record = getRecordData(id);

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

            {/* CHALLENGE CARD */}
            <div style={{ 
              background: "rgba(255, 106, 0, 0.03)", 
              border: "2px dashed rgba(255, 106, 0, 0.3)", 
              borderRadius: "32px", 
              padding: "40px", 
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <Trophy size={48} color="#FF6A00" style={{ marginBottom: "20px" }} />
              <h3 style={{ fontSize: "20px", fontWeight: "950", textTransform: "uppercase", marginBottom: "12px" }}>BEAT THIS RECORD?</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6", marginBottom: "28px" }}>
                Think you have what it takes to break this world record? Submit your attempt and enter the global hall of fame.
              </p>
              <Link to={`/challenge-verify?record=${encodeURIComponent(record.title)}`} style={{ textDecoration: "none", width: "100%" }}>
                <button style={{ 
                  background: "#FF6A00", 
                  color: "white", 
                  width: "100%",
                  padding: "18px 32px", 
                  borderRadius: "100px", 
                  border: "none", 
                  fontSize: "14px", 
                  fontWeight: "900", 
                  textTransform: "uppercase", 
                  cursor: "pointer",
                  transition: "all 0.3s",
                  boxShadow: "0 10px 20px rgba(255,106,0,0.2)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#e55e00";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FF6A00";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                >
                  CHALLENGE THIS RECORD
                </button>
              </Link>
            </div>

          </div>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default RecordDetail;
