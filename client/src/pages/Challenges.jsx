import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Play, Lock, Unlock, CheckCircle2 } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Challenges = () => {
  const categories = ["ALL", "STRENGTH", "ENDURANCE", "AGILITY"];

  const challengeCards = [
    { 
      id: 1, 
      title: "THE ROGUE MEDLEY", 
      holder: "Marcus Vane",
      cat: "STRENGTH",
      subcat: "Functional Strength",
      score: "1 min 42.50 sec",
      dateVerified: "2026-03-12",
      description: "A grueling multi-stage strength gauntlet consisting of rope pulls, heavy carries, and rapid tire flips.",
      rules: [
        "All equipment must meet official Rogue standards.",
        "Uncut video recording showing athlete and timer at all times.",
        "Tires must be flipped completely past the 50m line."
      ],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      participants: "2.1K", 
      difficulty: "HARD",
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 2, 
      title: "IRON LUNGS", 
      holder: "Sarah Jenkins",
      cat: "ENDURANCE",
      subcat: "Cardio Endurance",
      score: "42 min 15.00 sec",
      dateVerified: "2026-04-05",
      description: "Continuous maximum intensity treadmill challenge at an incline of 12% without holding the handrails.",
      rules: [
        "Treadmill must remain set at 12% incline throughout the run.",
        "No hand contact with console or rails after initial start.",
        "Uninterrupted biometric heart rate feed displayed on HUD."
      ],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      participants: "800", 
      difficulty: "ROGUE",
      img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 3, 
      title: "LIGHTNING REFLEX", 
      holder: "David Thorne",
      cat: "AGILITY",
      subcat: "Reflex Speed",
      score: "48.20 seconds",
      dateVerified: "2026-05-01",
      description: "A multi-target agility and footwork test requiring exact foot alignment on dynamic floor markers.",
      rules: [
        "Markers must be hit in sequential numerical order.",
        "Foot must fully cover the marker light on each step.",
        "Complete safety gear including knee pads must be worn."
      ],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      participants: "1.2K", 
      difficulty: "PRO",
      img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80" 
    },
    { 
      id: 4, 
      title: "TIRE FLIP GAUNTLET", 
      holder: "Viktor Drago",
      cat: "STRENGTH",
      subcat: "Power Challenges",
      score: "25 Reps / 2 Minutes",
      dateVerified: "2026-02-20",
      description: "Maximum repetitions of flipping a standard 300kg heavy duty tractor tire within a strict 120-second window.",
      rules: [
        "Tire weight must be certified at 300kg or greater.",
        "Repetitions only count when tire comes to a complete rest on the floor.",
        "Gloves and chalk are permitted."
      ],
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
      participants: "500", 
      difficulty: "HARD",
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80" 
    },
  ];

  const featuredChallenge = {
    id: 5,
    title: "THE APEX DECATHLON",
    holder: "Alex Thorne",
    cat: "AGILITY",
    subcat: "Speed & Reaction",
    score: "11 min 15.00 sec",
    dateVerified: "2026-05-10",
    description: "A continuous 10-stage test of extreme speed, agility, and quick decision making using precision reaction platforms.",
    rules: [
      "All 10 reaction phases must be completed in continuous sequence.",
      "Any missed marker results in immediate failure.",
      "Footwear must be standardized training shoes."
    ],
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    participants: "12.4K",
    difficulty: "ROGUE",
    img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
  };

  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [hasWatched, setHasWatched] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [showAllAttempts, setShowAllAttempts] = useState(false);

  useEffect(() => {
    if (selectedChallenge || selectedAttempt || showAllAttempts) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedChallenge, selectedAttempt, showAllAttempts]);

  const filteredChallenges = activeTab === "ALL" 
    ? challengeCards 
    : challengeCards.filter(c => c.cat === activeTab);

  const handleVideoTimeUpdate = (e) => {
    if (e.target.currentTime > 2 && !hasWatched) {
      setHasWatched(true);
    }
  };

  const handleVideoPlay = () => {
    setHasWatched(true);
  };

  const handleVideoEnded = () => {
    setHasWatched(true);
  };

  const getMockAttempts = (challenge) => {
    const attempts = [
      { id: 1, name: "James Walker", value: "35 Bounces", date: "May 16, 2026", status: "FAILED ATTEMPT", img: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=400&q=80", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
      { id: 2, name: "Alex Rodriguez", value: "34 Bounces", date: "May 15, 2026", status: "FAILED ATTEMPT", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
      { id: 3, name: "Liam Thompson", value: "35 Bounces", date: "May 14, 2026", status: "FAILED ATTEMPT", img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=400&q=80", color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
      { id: 4, name: "Daniel Kim", value: "36 Bounces", date: "May 12, 2026", status: "PENDING REVIEW", img: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=400&q=80", color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
      { id: 5, name: challenge ? challenge.holder : "Pavol Durdik", value: challenge ? challenge.score : "36 Bounces", date: "May 12, 2026", status: "CURRENT RECORD", img: challenge ? challenge.img : "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80", color: "#10B981", bg: "rgba(16, 185, 129, 0.1)", videoUrl: challenge ? challenge.videoUrl : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" }
    ];

    const statusOrder = {
      "CURRENT RECORD": 1,
      "PENDING REVIEW": 2,
      "APPROVED ATTEMPT": 3,
      "BROKEN": 4,
      "FAILED ATTEMPT": 5
    };

    return attempts.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
  };

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingTop: "180px", display: "flex", flexDirection: "column" }}>
        
        {/* NAVBAR */}
        <Navbar />

        {/* TOP HEADER - ACTIVE CHALLENGES */}
        <div style={{ padding: "40px 5% 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", color: "#FF6A00", letterSpacing: "0.1em" }}>ACTIVE CHALLENGES</h2>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>{filteredChallenges.length} AVAILABLE</span>
        </div>

        {/* MINI CHALLENGE CARDS */}
        <div style={{ padding: "0 5% 60px", display: "flex", gap: "20px", flexWrap: "wrap" }}>
          {[
            { title: "1000M ROW SPRINT", tag: "ELITE STATUS", progress: "40%" },
            { title: "ROGUE PLANK HOLD", tag: "TIME TRIAL", progress: "75%" }
          ].map((c, idx) => (
            <div key={idx} style={{ background: "#161616", padding: "20px 24px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)", width: "240px" }}>
              <div style={{ fontSize: "9px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase" }}>{c.tag}</div>
              <div style={{ fontSize: "14px", fontWeight: "800", marginBottom: "16px" }}>{c.title}</div>
              <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }}>
                <div style={{ width: c.progress, height: "100%", background: "#FF6A00", borderRadius: "2px" }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* HERO SECTION - FEATURED CHALLENGE */}
        <div style={{ position: "relative", height: "600px", margin: "0 5%", borderRadius: "40px", overflow: "hidden", display: "flex", alignItems: "center" }}>
          <img 
            src={featuredChallenge.img} 
            alt="Featured Challenge" 
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.6)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.9), transparent)" }} />
          
          <div style={{ position: "relative", zIndex: 2, padding: "0 80px" }}>
            <div style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", marginBottom: "16px", letterSpacing: "0.1em" }}>
              CHALLENGE OF THE MONTH
            </div>
            <h1 style={{ fontSize: "clamp(48px, 8vw, 96px)", fontWeight: "950", textTransform: "uppercase", lineHeight: "0.9", letterSpacing: "-0.04em", marginBottom: "20px" }}>
              <ScrollReveal>THE APEX</ScrollReveal> <br />
              <span style={{ color: "#FF6A00" }}><ScrollReveal>DECATHLON</ScrollReveal></span>
            </h1>
            
            <div style={{ display: "flex", gap: "40px", marginBottom: "40px" }}>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>PARTICIPANTS</div>
                <div style={{ fontSize: "18px", fontWeight: "900" }}>12.4K</div>
              </div>
              <div>
                <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>DIFFICULTY</div>
                <div style={{ fontSize: "18px", fontWeight: "900", color: "#FF6A00" }}>ROGUE</div>
              </div>
            </div>

            <button 
              onClick={() => { setSelectedChallenge(featuredChallenge); setHasWatched(false); }}
              style={{
                background: "#FF6A00",
                color: "white",
                border: "none",
                borderRadius: "100px",
                padding: "20px 48px",
                fontSize: "15px",
                fontWeight: "900",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                boxShadow: "0 10px 30px rgba(255,106,0,0.4)",
                transition: "all 0.3s"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              CHALLENGE RECORD <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div style={{ padding: "80px 5% 40px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveTab(cat)}
              style={{ 
                padding: "10px 24px", 
                borderRadius: "100px", 
                background: activeTab === cat ? "#FF6A00" : "rgba(255, 255, 255, 0.05)", 
                color: activeTab === cat ? "white" : "rgba(255, 255, 255, 0.5)", 
                border: "none", 
                fontSize: "11px", 
                fontWeight: "900", 
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* CHALLENGE GRID */}
        <div style={{ padding: "0 5% 100px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(500px, 1fr))", gap: "32px" }}>
          {filteredChallenges.map((card) => (
            <div 
              key={card.id} 
              onClick={() => { setSelectedChallenge(card); setHasWatched(false); }}
              style={{ position: "relative", height: "300px", borderRadius: "24px", overflow: "hidden", cursor: "pointer" }}
            >
              <img src={card.img} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,10,10,0.9), transparent)" }} />
              
              <div style={{ position: "absolute", top: "16px", left: "16px", display: "flex", gap: "8px" }}>
                <div style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900" }}>{card.difficulty} LEVEL</div>
                <div style={{ background: "rgba(255,106,0,0.2)", color: "#FF6A00", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900" }}>{card.participants} PARTICIPATING</div>
              </div>

              <div style={{ position: "absolute", bottom: "32px", left: "32px", right: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <h3 style={{ fontSize: "28px", fontWeight: "900", textTransform: "uppercase" }}>{card.title}</h3>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChallenge(card);
                    setHasWatched(false);
                  }}
                  style={{
                    background: "#FF6A00",
                    color: "white",
                    border: "none",
                    borderRadius: "100px",
                    padding: "12px 28px",
                    fontSize: "11px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    boxShadow: "0 5px 15px rgba(255,106,0,0.3)",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  CHALLENGE RECORD <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* DETAILED CHALLENGE OVERLAY MODAL */}
        {selectedChallenge && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "40px"
          }}>
            <div style={{
              background: "#121212",
              border: "1px solid rgba(255, 106, 0, 0.2)",
              borderRadius: "40px",
              width: "100%",
              maxWidth: "1150px",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 50px 100px rgba(0,0,0,0.8)"
            }}>
              {/* Close Button */}
              <button 
                onClick={() => {
                  setSelectedChallenge(null);
                  setHasWatched(false);
                }}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  cursor: "pointer",
                  zIndex: 10,
                  fontSize: "18px",
                  fontWeight: "bold"
                }}
              >
                ✕
              </button>

              {/* Content Top Part */}
              <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
                {/* Video Player Side */}
                <div style={{ flex: "1.2", background: "black", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", overflow: "hidden" }}>
                <video
                  src={selectedChallenge.videoUrl}
                  controls
                  autoPlay
                  onPlay={handleVideoPlay}
                  onTimeUpdate={handleVideoTimeUpdate}
                  onEnded={handleVideoEnded}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                {!hasWatched && (
                  <div style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    background: "rgba(0,0,0,0.75)",
                    border: "1px solid #FF6A00",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "900",
                    color: "#FF6A00",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <Lock size={12} /> Watch video to unlock challenge
                  </div>
                )}
                {hasWatched && (
                  <div style={{
                    position: "absolute",
                    top: "24px",
                    left: "24px",
                    background: "rgba(34, 197, 94, 0.95)",
                    border: "1px solid #22c55e",
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontSize: "11px",
                    fontWeight: "900",
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    <CheckCircle2 size={12} /> Record Watched - Challenge Unlocked
                  </div>
                )}
              </div>

                {/* Record Metadata Side */}
                <div style={{ flex: "1", overflowY: "auto", height: "100%" }}>
                  <div style={{ padding: "40px 50px", display: "flex", flexDirection: "column", gap: "28px", textAlign: "left" }}>
                    <div>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                        <span style={{ background: "rgba(255,106,0,0.1)", color: "#FF6A00", fontSize: "10px", fontWeight: "900", padding: "4px 12px", borderRadius: "100px", textTransform: "uppercase" }}>{selectedChallenge.cat}</span>
                        <span style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.6)", fontSize: "10px", fontWeight: "900", padding: "4px 12px", borderRadius: "100px" }}>{selectedChallenge.subcat}</span>
                      </div>
                      <h2 style={{ fontSize: "36px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.02em", color: "white", lineHeight: "1.1" }}>{selectedChallenge.title}</h2>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginTop: "8px" }}>Record Holder: <strong style={{ color: "white" }}>{selectedChallenge.holder}</strong></p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "20px", borderRadius: "16px" }}>
                      <div>
                        <div style={{ fontSize: "9px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Official Score</div>
                        <div style={{ fontSize: "18px", fontWeight: "950", color: "#FF6A00" }}>{selectedChallenge.score}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Date Verified</div>
                        <div style={{ fontSize: "16px", fontWeight: "800", color: "white" }}>{selectedChallenge.dateVerified}</div>
                      </div>
                    </div>

                    <div>
                      <h4 style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>DESCRIPTION</h4>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>{selectedChallenge.description}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "10px" }}>OFFICIAL RULES</h4>
                      <ul style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                        {selectedChallenge.rules.map((rule, idx) => (
                          <li key={idx} style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5" }}>{rule}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                      {hasWatched ? (
                        <Link to="/challenge-verify" style={{ textDecoration: "none" }}>
                          <button style={{
                            width: "100%",
                            background: "#FF6A00",
                            color: "white",
                            border: "none",
                            borderRadius: "100px",
                            padding: "20px",
                            fontSize: "14px",
                            fontWeight: "900",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                            boxShadow: "0 10px 20px rgba(255,106,0,0.3)",
                            transition: "0.3s"
                          }}>
                            CHALLENGE THIS RECORD <ArrowRight size={18} />
                          </button>
                        </Link>
                      ) : (
                        <button 
                          disabled
                          style={{
                            width: "100%",
                            background: "rgba(255,255,255,0.03)",
                            color: "rgba(255,255,255,0.25)",
                            border: "1px solid rgba(255,255,255,0.05)",
                            borderRadius: "100px",
                            padding: "20px",
                            fontSize: "14px",
                            fontWeight: "900",
                            textTransform: "uppercase",
                            cursor: "not-allowed",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px"
                          }}
                        >
                          <Lock size={14} /> WATCH RECORD VIDEO TO CHALLENGE
                        </button>
                      )}
                    </div>
                  </div>
                </div>
            </div>

            {/* ATTEMPT HISTORY SECTION */}
            <div style={{ background: "#080808", borderTop: "1px solid rgba(255,255,255,0.05)", padding: "24px 40px", flexShrink: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "16px" }}>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>ATTEMPT HISTORY</h3>
                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>See how other members have attempted to break this record.</p>
                </div>
                <button 
                  onClick={() => setShowAllAttempts(true)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6A00", fontSize: "11px", fontWeight: "800", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em", flexShrink: 0 }}>
                  VIEW ALL ATTEMPTS {">"}
                </button>
              </div>

              <div className="attempt-history-scroll" style={{ 
                display: "flex", 
                gap: "16px", 
                overflowX: "auto", 
                paddingBottom: "8px",
                msOverflowStyle: "none", 
                scrollbarWidth: "none"
              }}>
                <style>{`
                  .attempt-history-scroll::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {getMockAttempts(selectedChallenge).map(attempt => (
                    <div key={attempt.id} 
                      onClick={() => setSelectedAttempt(attempt)}
                      style={{ 
                      flex: "0 0 200px", 
                      width: "200px",
                      background: "#161616", 
                      borderRadius: "12px", 
                      overflow: "hidden", 
                      border: attempt.status === "CURRENT RECORD" ? "1px solid #10B981" : "1px solid rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    >
                    {/* Thumbnail */}
                    <div style={{ position: "relative", height: "100px" }}>
                      <img src={attempt.img} alt={attempt.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
                          <Play fill="white" size={12} />
                        </div>
                      </div>
                      <div style={{ position: "absolute", bottom: "6px", right: "6px", background: "rgba(0,0,0,0.8)", padding: "2px 6px", borderRadius: "4px", fontSize: "9px", fontWeight: "700" }}>
                        0:00
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div style={{ padding: "12px" }}>
                      <div style={{ fontSize: "12px", fontWeight: "800", marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "uppercase" }}>{attempt.name}</div>
                      <div style={{ fontSize: "11px", color: "#FF6A00", fontWeight: "700", marginBottom: "10px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{attempt.value}</div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "6px" }}>
                        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>{attempt.date}</div>
                        <div style={{ fontSize: "8px", fontWeight: "900", padding: "3px 6px", borderRadius: "4px", background: attempt.bg, color: attempt.color, textTransform: "uppercase" }}>
                          {attempt.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            </div>
          </div>
        )}

        {/* ALL ATTEMPTS OVERLAY */}
        {showAllAttempts && selectedChallenge && (
          <div data-lenis-prevent="true" style={{
            position: "fixed",
            inset: 0,
            background: "#0A0A0A",
            zIndex: 10000,
            overflowY: "auto",
            padding: "80px 5%"
          }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
              <button 
                onClick={() => setShowAllAttempts(false)} 
                style={{ display: "flex", alignItems: "center", gap: "8px", color: "#FF6A00", background: "none", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: "800", textTransform: "uppercase", marginBottom: "40px" }}>
                <ArrowLeft size={16} /> BACK TO CHALLENGE DETAIL
              </button>

              <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px", color: "white" }}>
                ALL ATTEMPTS: <span style={{ color: "#FF6A00" }}>{selectedChallenge.title}</span>
              </h1>
              <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", marginBottom: "40px" }}>Browse all verification attempts submitted by members for this specific record.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "32px" }}>
                {getMockAttempts(selectedChallenge).map(attempt => (
                  <div key={attempt.id} 
                    onClick={() => setSelectedAttempt(attempt)}
                    style={{ 
                      background: "#161616", 
                      borderRadius: "16px", 
                      overflow: "hidden", 
                      border: attempt.status === "CURRENT RECORD" ? "1px solid #10B981" : "1px solid rgba(255,255,255,0.05)",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                    >
                    {/* Thumbnail */}
                    <div style={{ position: "relative", height: "180px" }}>
                      <img src={attempt.img} alt={attempt.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
                          <Play fill="white" size={24} />
                        </div>
                      </div>
                      <div style={{ position: "absolute", bottom: "12px", right: "12px", background: "rgba(0,0,0,0.8)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "700" }}>
                        0:00
                      </div>
                    </div>
                    
                    {/* Info */}
                    <div style={{ padding: "24px" }}>
                      <div style={{ fontSize: "18px", fontWeight: "900", marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textTransform: "uppercase", color: "white" }}>{attempt.name}</div>
                      <div style={{ fontSize: "16px", color: "#FF6A00", fontWeight: "800", marginBottom: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{attempt.value}</div>
                      
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "700" }}>{attempt.date}</div>
                        <div style={{ fontSize: "10px", fontWeight: "900", padding: "6px 10px", borderRadius: "4px", background: attempt.bg, color: attempt.color, textTransform: "uppercase" }}>
                          {attempt.status}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <Footer />

        {/* ATTEMPT VIDEO MODAL */}
        {selectedAttempt && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10001,
            padding: "40px"
          }}>
            <div style={{
              background: "#121212",
              border: `1px solid ${selectedAttempt.color || '#FF6A00'}`,
              borderRadius: "40px",
              width: "100%",
              maxWidth: "1150px",
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
              boxShadow: "0 50px 100px rgba(0,0,0,0.8)"
            }}>
              <button 
                onClick={() => setSelectedAttempt(null)}
                style={{
                  position: "absolute",
                  top: "24px",
                  right: "24px",
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  cursor: "pointer",
                  zIndex: 10,
                  fontSize: "18px",
                  fontWeight: "bold"
                }}
              >✕</button>
              <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
                <div style={{ flex: "1.2", background: "black", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", height: "100%", overflow: "hidden" }}>
                  <video
                    src={selectedAttempt.videoUrl}
                    controls
                    autoPlay
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>
                <div data-lenis-prevent="true" style={{ flex: "1", overflowY: "auto", height: "100%", background: "#161616" }}>
                  <div style={{ padding: "40px 50px", display: "flex", flexDirection: "column", gap: "28px", textAlign: "left" }}>
                    <div>
                      <span style={{ background: selectedAttempt.bg, color: selectedAttempt.color, fontSize: "12px", fontWeight: "900", padding: "6px 16px", borderRadius: "100px", textTransform: "uppercase" }}>{selectedAttempt.status}</span>
                      <h2 style={{ fontSize: "32px", fontWeight: "950", textTransform: "uppercase", color: "white", lineHeight: "1.1", marginTop: "24px", marginBottom: "8px" }}>{selectedAttempt.name}</h2>
                      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: "600" }}>Attempt Date: <strong style={{ color: "white" }}>{selectedAttempt.date}</strong></p>
                    </div>

                    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "24px", borderRadius: "16px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>Recorded Score / Result</div>
                      <div style={{ fontSize: "24px", fontWeight: "950", color: selectedAttempt.color }}>{selectedAttempt.value}</div>
                    </div>

                    {selectedAttempt.img && (
                      <div>
                        <h4 style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>ATTEMPT THUMBNAIL</h4>
                        <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)" }}>
                          <img src={selectedAttempt.img} alt={selectedAttempt.name} style={{ width: "100%", height: "auto", display: "block" }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Challenges;
