import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Star, 
  ShieldCheck, 
  Zap, 
  Crown, 
  ArrowRight, 
  Check, 
  Trophy, 
  Activity, 
  Shield, 
  Globe, 
  User, 
  Award, 
  Clock, 
  CheckCircle2, 
  XCircle,
  Gem,
  Rocket
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { motion } from "framer-motion";

const EliteMembership = () => {
  const [activeTab, setActiveTab] = useState("MONTHLY");
  const [selectedTier, setSelectedTier] = useState("silver");
  const [selectedPack, setSelectedPack] = useState(1);
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const tiers = [
    {
      name: "Free",
      id: "free",
      cost: "FREE",
      limit: "2 Submissions / Month",
      color: "#94A3B8",
      icon: <User size={32} />,
      perfectFor: "New users exploring the platform and casual competitors.",
      includes: [
        "Create an official account",
        "Browse all world records",
        "View public leaderboards",
        "2 standard record submissions monthly",
        "Access to community forums",
        "Digital participation badges",
        "Basic profile customization",
        "Follow competitors and categories"
      ],
      notIncluded: [
        "No priority verification",
        "No premium competitions",
        "No cash-prize event access",
        "No elite status badges"
      ]
    },
    {
      name: "Bronze",
      id: "bronze",
      cost: "$9.99",
      limit: "5 Submissions / Month",
      color: "#CD7F32",
      icon: <Award size={32} />,
      perfectFor: "Competitors beginning their journey and wanting more platform access.",
      includes: [
        "Everything in Free Membership",
        "5 monthly record submissions",
        "Bronze Member verification badge",
        "Faster support response times",
        "Access to member-only challenges",
        "Eligibility for select prize events",
        "Basic analytics & stats tracking",
        "Discounted event entry fees"
      ],
      popular: false
    },
    {
      name: "Silver",
      id: "silver",
      cost: "$19.99",
      limit: "15 Submissions / Month",
      color: "#C0C0C0",
      icon: <Gem size={32} />,
      perfectFor: "Serious competitors aiming to grow their rankings and recognition.",
      includes: [
        "Everything in Bronze Membership",
        "15 monthly record submissions",
        "Priority submission review",
        "Silver verified profile badge",
        "Advanced statistics dashboard",
        "Access to premium competitions",
        "Silver achievement certificates",
        "Featured competitor opportunities"
      ],
      popular: true
    },
    {
      name: "Gold",
      id: "gold",
      cost: "$39.99",
      limit: "Unlimited Submissions",
      color: "#FFD700",
      icon: <Crown size={32} />,
      perfectFor: "Elite competitors, professionals, influencers, and top-ranked challengers.",
      includes: [
        "Everything in Silver Membership",
        "Unlimited record submissions",
        "Highest priority verification (VIP)",
        "Gold verified elite member badge",
        "VIP support access (24/7)",
        "Entry into elite championships",
        "Front-page profile promotion",
        "Official printable Gold certificates"
      ],
      popular: false
    }
  ];

  const comparisonData = [
    { feature: "Record Submissions", free: "2 / Month", bronze: "5 / Month", silver: "15 / Month", gold: "Unlimited" },
    { feature: "Verification Priority", free: "Standard", bronze: "Basic", silver: "Priority", gold: "VIP Priority" },
    { feature: "Competition Access", free: "Limited", bronze: "Expanded", silver: "Premium", gold: "Elite" },
    { feature: "Cash Prize Eligibility", free: "No", bronze: "Select Events", silver: "Yes", gold: "Yes" },
    { feature: "Member Badge", free: "Basic", bronze: "Bronze", silver: "Silver", gold: "Gold" },
    { feature: "VIP Support", free: "No", bronze: "No", silver: "No", gold: "Yes (Direct)" },
    { feature: "Global Ranking Priority", free: "No", bronze: "Limited", silver: "Expanded", gold: "Premium" },
    { feature: "Exclusive Events", free: "No", bronze: "No", silver: "Limited", gold: "Yes" },
  ];

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />

        {/* HERO SECTION */}
        <section style={{ padding: "220px 5% 100px", position: "relative", overflow: "hidden" }}>
          {/* Decorative Elements */}
          <div style={{ position: "absolute", top: "0", right: "0", width: "800px", height: "800px", background: "radial-gradient(circle, rgba(255,106,0,0.06) 0%, transparent 70%)", zIndex: 0 }} />
          
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
            <ScrollReveal>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,106,0,0.1)", padding: "8px 24px", borderRadius: "100px", border: "1px solid rgba(255,106,0,0.2)", marginBottom: "32px" }}>
                <Gem size={16} color="#FF6A00" />
                <span style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.2em", textTransform: "uppercase" }}>ROGUE MEMBERSHIPS</span>
              </div>
              <h1 style={{ fontSize: "clamp(40px, 9vw, 110px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.85", marginBottom: "40px" }}>
                CHOOSE YOUR <br />
                <span style={{ color: "#FF6A00" }}>PATH TO GREATNESS</span>
              </h1>
              <p style={{ fontSize: "20px", color: "rgba(255,255,255,0.5)", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
                Whether you are just getting started or planning to compete at the highest level, our membership tiers provide the recognition and tools you need to succeed.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* PRICING CARDS */}
        <section style={{ padding: "0 5% 120px" }}>
          <div style={{ 
            maxWidth: "1200px", 
            margin: "0 auto", 
            display: "grid", 
            gridTemplateColumns: windowWidth > 1024 ? "repeat(2, 1fr)" : "1fr", 
            gap: "32px" 
          }}>
            {tiers.map((tier) => {
              const isSelected = selectedTier === tier.id;
              return (
                <ScrollReveal key={tier.id}>
                  <div 
                    onClick={() => setSelectedTier(tier.id)}
                    style={{ 
                      background: isSelected ? "linear-gradient(135deg, rgba(255,106,0,0.06) 0%, rgba(10,10,10,0.95) 100%)" : "rgba(255,255,255,0.02)", 
                      border: isSelected ? "2px solid #FF6A00" : "1px solid rgba(255,255,255,0.05)", 
                      borderRadius: "48px", 
                      padding: "60px",
                      height: "100%",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      cursor: "pointer",
                      transform: isSelected ? "translateY(-6px)" : "translateY(0)",
                      boxShadow: isSelected ? "0 20px 40px rgba(255,106,0,0.15)" : "none",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    onMouseEnter={e => {
                      if (!isSelected) {
                        e.currentTarget.style.border = "1px solid rgba(255, 106, 0, 0.35)";
                        e.currentTarget.style.transform = "translateY(-6px)";
                        e.currentTarget.style.boxShadow = "0 15px 30px rgba(255, 106, 0, 0.05)";
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isSelected) {
                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)";
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }
                    }}
                  >
                    {tier.popular && (
                      <div style={{ position: "absolute", top: "24px", right: "48px", background: "#FF6A00", color: "white", padding: "6px 16px", borderRadius: "100px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}>
                        MOST POPULAR
                      </div>
                    )}
                    
                    <div style={{ color: isSelected ? "#FF6A00" : tier.color, marginBottom: "24px", transition: "color 0.3s" }}>{tier.icon}</div>
                    <h3 style={{ fontSize: "24px", fontWeight: "900", textTransform: "uppercase", marginBottom: "8px" }}>{tier.name}</h3>
                    <div style={{ fontSize: "40px", fontWeight: "950", marginBottom: "8px", color: isSelected ? "#FF6A00" : tier.name === "Free" ? "white" : tier.color, transition: "color 0.3s" }}>
                      {tier.cost}{tier.name !== "Free" && <span style={{ fontSize: "16px", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>/month</span>}
                    </div>
                    <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", padding: "6px 16px", borderRadius: "100px", fontSize: "12px", fontWeight: "800", color: "#FF6A00", marginBottom: "32px", width: "fit-content" }}>
                      {tier.limit}
                    </div>

                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6", marginBottom: "40px", height: "45px" }}>
                      {tier.perfectFor}
                    </p>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "20px" }}>WHAT'S INCLUDED</div>
                      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
                        {tier.includes.map((item, i) => (
                          <li key={i} style={{ display: "flex", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                            <Check size={16} color={isSelected ? "#FF6A00" : tier.color} style={{ flexShrink: 0, marginTop: "2px" }} /> {item}
                          </li>
                        ))}
                        {tier.notIncluded && tier.notIncluded.map((item, i) => (
                          <li key={i} style={{ display: "flex", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.2)" }}>
                            <XCircle size={16} color="rgba(255,255,255,0.1)" style={{ flexShrink: 0, marginTop: "2px" }} /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button style={{ 
                      width: "100%", 
                      background: isSelected ? "#FF6A00" : "rgba(255,255,255,0.05)", 
                      color: isSelected ? "white" : "rgba(255,255,255,0.6)",
                      border: isSelected ? "none" : "1px solid rgba(255,255,255,0.1)",
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
                      boxShadow: isSelected ? "0 10px 20px rgba(255,106,0,0.2)" : "none",
                      transition: "all 0.3s"
                    }}>
                      {tier.name === "Free" ? "JOIN FOR FREE" : `GET ${tier.name.toUpperCase()}`} <ArrowRight size={18} />
                    </button>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section style={{ padding: "0 5% 120px" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <ScrollReveal>
              <h2 style={{ fontSize: "40px", fontWeight: "950", textTransform: "uppercase", textAlign: "center", marginBottom: "60px" }}>FULL COMPARISON</h2>
              <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.05)", overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <th style={{ padding: "32px", textAlign: "left", fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>FEATURES</th>
                      <th style={{ padding: "32px", textAlign: "center", fontSize: "14px", fontWeight: "900" }}>FREE</th>
                      <th style={{ padding: "32px", textAlign: "center", fontSize: "14px", fontWeight: "900", color: "#CD7F32" }}>BRONZE</th>
                      <th style={{ padding: "32px", textAlign: "center", fontSize: "14px", fontWeight: "900", color: "#C0C0C0" }}>SILVER</th>
                      <th style={{ padding: "32px", textAlign: "center", fontSize: "14px", fontWeight: "900", color: "#FFD700" }}>GOLD</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, i) => (
                      <tr key={i} style={{ borderBottom: i === comparisonData.length - 1 ? "none" : "1px solid rgba(255,255,255,0.03)" }}>
                        <td style={{ padding: "24px 32px", fontSize: "15px", fontWeight: "700" }}>{row.feature}</td>
                        <td style={{ padding: "24px 32px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>{row.free === "No" ? <XCircle size={16} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto" }} /> : row.free}</td>
                        <td style={{ padding: "24px 32px", textAlign: "center", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>{row.bronze === "No" ? <XCircle size={16} color="rgba(255,255,255,0.1)" style={{ margin: "0 auto" }} /> : row.bronze}</td>
                        <td style={{ padding: "24px 32px", textAlign: "center", fontSize: "14px", color: "white" }}>{row.silver}</td>
                        <td style={{ padding: "24px 32px", textAlign: "center", fontSize: "14px", color: "#FFD700", fontWeight: "800" }}>{row.gold}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ADD-ON PACKS */}
        <section style={{ padding: "100px 5%", background: "rgba(255,106,0,0.03)", borderTop: "1px solid rgba(255,106,0,0.1)", borderBottom: "1px solid rgba(255,106,0,0.1)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
            <ScrollReveal>
              <h2 style={{ fontSize: "48px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>EXTRA SUBMISSION PACKS</h2>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px", marginBottom: "60px" }}>Need just one more shot at history? Unlock additional submission slots instantly.</p>
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
                {[
                  { count: "1 EXTRA SUBMISSION", price: "$4.99", icon: <Zap size={24} /> },
                  { count: "5 EXTRA SUBMISSIONS", price: "$14.99", icon: <Activity size={24} />, popular: true },
                  { count: "10 EXTRA SUBMISSIONS", price: "$24.99", icon: <Trophy size={24} /> }
                ].map((pack, i) => {
                  const isSelected = selectedPack === i;
                  return (
                    <div 
                      key={i} 
                      onClick={() => setSelectedPack(i)}
                      style={{ 
                        background: "#0A0A0A", 
                        borderRadius: "32px", 
                        padding: "40px", 
                        border: isSelected ? "2px solid #FF6A00" : "1px solid rgba(255,255,255,0.05)", 
                        position: "relative",
                        cursor: "pointer",
                        transform: isSelected ? "translateY(-8px)" : "translateY(0)",
                        boxShadow: isSelected ? "0 20px 40px rgba(255, 106, 0, 0.15)" : "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      {pack.popular && <div style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)", background: "#FF6A00", color: "white", padding: "4px 16px", borderRadius: "100px", fontSize: "10px", fontWeight: "900" }}>BEST VALUE</div>}
                      <div style={{ color: "#FF6A00", marginBottom: "20px", display: "flex", justifyContent: "center" }}>{pack.icon}</div>
                      <div style={{ fontSize: "14px", fontWeight: "800", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>{pack.count}</div>
                      <div style={{ fontSize: "40px", fontWeight: "950", color: "white", marginBottom: "32px" }}>{pack.price}</div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPack(i);
                        }}
                        style={{ 
                          width: "100%", 
                          background: isSelected ? "#FF6A00" : "rgba(255,255,255,0.05)", 
                          color: "white", 
                          border: isSelected ? "none" : "1px solid rgba(255,255,255,0.1)", 
                          borderRadius: "100px", 
                          padding: "18px", 
                          fontSize: "14px", 
                          fontWeight: "900", 
                          cursor: "pointer", 
                          transition: "all 0.3s ease",
                          boxShadow: isSelected ? "0 10px 20px rgba(255, 106, 0, 0.3)" : "none"
                        }} 
                        onMouseEnter={e => {
                          if (!isSelected) e.currentTarget.style.background = "rgba(255, 106, 0, 0.2)";
                        }} 
                        onMouseLeave={e => {
                          if (!isSelected) e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                      >
                        PURCHASE PACK
                      </button>
                    </div>
                  );
                })}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* WHY BECOME A MEMBER */}
        <section style={{ padding: "120px 5%" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "80px", alignItems: "center" }}>
              <ScrollReveal>
                <h2 style={{ fontSize: "56px", fontWeight: "950", textTransform: "uppercase", lineHeight: "0.95", marginBottom: "32px" }}>
                  WHY BECOME <br /><span style={{ color: "#FF6A00" }}>A MEMBER?</span>
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {[
                    "Gain recognition faster with priority verification reviews.",
                    "Access exclusive competitions and cash-prize tournaments.",
                    "Build your worldwide reputation with verified status badges.",
                    "Unlock advanced analytics and competitor tracking tools.",
                    "Join an elite community of record breakers globally."
                  ].map((text, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                      <div style={{ width: "24px", height: "24px", background: "rgba(255,106,0,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Check size={14} color="#FF6A00" />
                      </div>
                      <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", lineHeight: "1.5" }}>{text}</p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal>
                <div style={{ background: "rgba(255,255,255,0.02)", borderRadius: "40px", padding: "60px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "center" }}>
                  <Rocket size={64} color="#FF6A00" style={{ marginBottom: "32px" }} />
                  <h3 style={{ fontSize: "32px", fontWeight: "950", textTransform: "uppercase", marginBottom: "20px" }}>READY TO SCALE?</h3>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "18px", marginBottom: "40px" }}>
                    Members can upgrade or cancel their memberships at any time through their account dashboard.
                  </p>
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <button style={{ background: "#FF6A00", color: "white", padding: "20px 48px", borderRadius: "100px", border: "none", fontSize: "15px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "12px" }}>
                      UPGRADE NOW <ArrowRight size={20} />
                    </button>
                  </Link>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FINAL MESSAGE */}
        <section style={{ padding: "0 5% 120px" }}>
          <ScrollReveal>
            <div className="orange-cta" style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 40px", borderRadius: "40px" }}>
              <div className="orange-cta-bg" />
              <div className="orange-cta-grid" />
              <div className="orange-cta-glow" />

              <div className="orange-cta-content" style={{ textAlign: "center" }}>
                <Trophy size={64} color="white" style={{ marginBottom: "32px", opacity: 0.8 }} />
                <h2 className="orange-cta-title" style={{ fontSize: "clamp(32px, 5vw, 64px)", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px", color: "white" }}>
                  CHAMPIONS <br /><span className="orange-cta-highlight">START HERE</span>
                </h2>
                <p className="orange-cta-subtitle" style={{ maxWidth: "700px", margin: "0 auto 48px", fontSize: "18px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6" }}>
                  No matter where you begin, every champion starts somewhere. Your journey toward greatness starts with one decision to push beyond limits.
                </p>
                <div style={{ fontSize: "20px", fontWeight: "950", color: "white", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Break Limits. Make History. Become Legendary.
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <Footer />
      </div>
    </PageTransition>
  );
};

export default EliteMembership;
