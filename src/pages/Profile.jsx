import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Trophy, MapPin, Calendar, Activity, Zap, Timer, CheckCircle2, Share2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ATHLETES = {
  "leo-vance": {
    name: "Leo Vance",
    rank: "02",
    img: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=700&q=80",
    cover: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
    cat: "STRENGTH",
    location: "London, UK",
    since: "2022",
    records: "4",
    bio: "Strength specialist focused on deadlift and overhead press records. Dedicated to pushing human limits in powerlifting.",
    stats: [
      { label: "Total Records", value: "4", sub: "Strength Div" },
      { label: "Power Rank", value: "A+", sub: "Global" },
      { label: "Verified", value: "100%", sub: "Audit Pass" }
    ],
    recordList: [
      { title: "Heaviest Deadlift (One Hand)", category: "Strength", value: "185kg", date: "Jan 2024" },
      { title: "Most Pushups in 10 Minutes", category: "Endurance", value: "542", date: "Mar 2024" }
    ]
  },
  "jamal-carter": {
    name: "Jamal Carter",
    rank: "01",
    img: "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=800&q=80",
    cover: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1600&q=80",
    cat: "SPEED",
    location: "New York, USA",
    since: "2021",
    records: "7",
    bio: "Fastest man on sand and hurdles. Record breaker in multiple track categories across three continents.",
    stats: [
      { label: "Total Records", value: "7", sub: "Speed Div" },
      { label: "Agility Rank", value: "S", sub: "World Rank" },
      { label: "Verified", value: "100%", sub: "Audit Pass" }
    ],
    recordList: [
      { title: "Fastest 100m Sand Sprint", category: "Speed", value: "10.4s", date: "Oct 2023" },
      { title: "Most Hurdles Jumped in 30s", category: "Agility", value: "28", date: "Dec 2023" }
    ]
  },
  "elena-petrov": {
    name: "Elena Petrov",
    rank: "04",
    img: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=700&q=80",
    cover: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80",
    cat: "ENDURANCE",
    location: "Moscow, Russia",
    since: "2023",
    records: "2",
    bio: "Long distance specialist. Holding multiple records in stationary plank and long-form treadmill runs.",
    stats: [
      { label: "Total Records", value: "2", sub: "Endurance Div" },
      { label: "Stamina Rank", value: "A", sub: "Continental" },
      { label: "Verified", value: "100%", sub: "Audit Pass" }
    ],
    recordList: [
      { title: "Longest Stationary Plank", category: "Endurance", value: "4h 12m", date: "Nov 2023" }
    ]
  },
  "iron-k.": {
    name: "Iron K.",
    rank: "03",
    img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=80",
    cover: "https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=1600&q=80",
    cat: "GYM",
    location: "Berlin, Germany",
    since: "2020",
    records: "5",
    bio: "Gymnastics and bodyweight mastery. Expert in calisthenics records and high-intensity interval performance.",
    stats: [
      { label: "Total Records", value: "5", sub: "Calisthenics" },
      { label: "Balance Rank", value: "B+", sub: "Regional" },
      { label: "Verified", value: "100%", sub: "Audit Pass" }
    ],
    recordList: [
      { title: "Most Muscle Ups in 1 Minute", category: "Gym", value: "18", date: "Jan 2024" }
    ]
  },
  "marcus-s.": {
    name: "Marcus S.",
    rank: "05",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=700&q=80",
    cover: "https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&w=1600&q=80",
    cat: "TRACK",
    location: "Sydney, Australia",
    since: "2024",
    records: "3",
    bio: "Rising star in track events. Focused on mid-distance speed and agility drills.",
    stats: [
      { label: "Total Records", value: "3", sub: "Track Div" },
      { label: "Potential Rank", value: "S+", sub: "Emerging" },
      { label: "Verified", value: "100%", sub: "Audit Pass" }
    ],
    recordList: [
      { title: "Fastest 400m Shuttle Run", category: "Track", value: "48.2s", date: "Feb 2024" }
    ]
  }
};

const Profile = () => {
  const { id } = useParams();
  const athlete = ATHLETES[id] || ATHLETES["jamal-carter"]; // Fallback to jamal-carter if id not found

  return (
    <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* Hero Header Section */}
      <section style={{ position: "relative", height: "500px", overflow: "hidden" }}>
        <img 
          src={athlete.cover} 
          alt="Profile Cover" 
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }}
        />
        <div style={{ 
          position: "absolute", 
          bottom: 0, 
          left: 0, 
          right: 0, 
          height: "300px", 
          background: "linear-gradient(to top, #0A0A0A 10%, transparent 100%)" 
        }} />

        <div className="container" style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", width: "100%", display: "flex", alignItems: "flex-end", gap: "32px" }}>
          <div style={{ position: "relative" }}>
            <img 
              src={athlete.img} 
              alt="Avatar" 
              style={{ width: "180px", height: "180px", borderRadius: "24px", border: "4px solid #FF6A00", objectFit: "cover", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
            />
            <div style={{ position: "absolute", bottom: "-10px", right: "-10px", background: "#FF6A00", color: "white", padding: "8px 16px", borderRadius: "100px", fontWeight: "900", fontSize: "14px", border: "4px solid #0A0A0A" }}>
              RANK #{athlete.rank}
            </div>
          </div>

          <div style={{ flex: 1, paddingBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <span style={{ background: "rgba(255,106,0,0.2)", color: "#FF6A00", padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "800", letterSpacing: "1px" }}>PRO ATHLETE</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <CheckCircle2 size={16} color="#FF6A00" />
                <span style={{ fontSize: "13px", color: "#aaa" }}>Verified Record Holder</span>
              </div>
            </div>
            <h1 style={{ fontSize: "64px", fontWeight: "900", margin: 0, textTransform: "uppercase", letterSpacing: "-2px", lineHeight: 1 }}>{athlete.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "24px", marginTop: "16px", color: "#888", fontSize: "14px" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={16} /> {athlete.location}</span>
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Calendar size={16} /> Member since {athlete.since}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container" style={{ padding: "80px 0", display: "grid", gridTemplateColumns: "1fr 350px", gap: "60px" }}>
        
        {/* Left Column: Stats & Records */}
        <div>
          <div style={{ marginBottom: "60px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "24px", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
              <Activity color="#FF6A00" /> BIOMETRIC PERFORMANCE
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
              {athlete.stats.map((stat, i) => (
                <div key={i} style={{ background: "#151515", padding: "24px", borderRadius: "16px", border: "1px solid #222" }}>
                  <div style={{ color: "#888", fontSize: "12px", fontWeight: "700", textTransform: "uppercase", marginBottom: "8px" }}>{stat.label}</div>
                  <div style={{ fontSize: "32px", fontWeight: "900", color: "#FF6A00" }}>{stat.value}</div>
                  <div style={{ color: "#555", fontSize: "11px", marginTop: "4px" }}>{stat.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "24px", color: "white", display: "flex", alignItems: "center", gap: "12px" }}>
              <Trophy color="#FF6A00" /> ACTIVE WORLD RECORDS
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {athlete.recordList.map((record, i) => (
                <div key={i} style={{ background: "#111", padding: "24px", borderRadius: "16px", border: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "transform 0.2s, border-color 0.2s", cursor: "pointer" }} className="record-item-hover">
                  <div>
                    <div style={{ color: "#FF6A00", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", marginBottom: "4px" }}>{record.category}</div>
                    <div style={{ fontSize: "18px", fontWeight: "700", color: "white" }}>{record.title}</div>
                    <div style={{ color: "#555", fontSize: "12px", marginTop: "4px" }}>Verified on {record.date}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "24px", fontWeight: "900", color: "white" }}>{record.value}</div>
                    <div style={{ color: "#FF6A00", fontSize: "11px", fontWeight: "700" }}>WORLD RECORD</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar info */}
        <div>
          <div style={{ background: "#151515", padding: "32px", borderRadius: "24px", border: "1px solid #222", position: "sticky", top: "100px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "20px" }}>ATHLETE BIO</h3>
            <p style={{ color: "#888", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              {athlete.bio}
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", borderTop: "1px solid #222", paddingTop: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#555", fontSize: "13px" }}>Level</span>
                <span style={{ fontWeight: "700" }}>Elite</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#555", fontSize: "13px" }}>Status</span>
                <span style={{ fontWeight: "700", color: "#FF6A00" }}>Active</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      <Footer />

      <style>{`
        .record-item-hover:hover { 
          transform: translateX(10px);
          border-color: #FF6A00 !important;
          background: #151515 !important;
        }
      `}</style>
    </div>
  );
};

export default Profile;
