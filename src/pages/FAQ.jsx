import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  Trophy, 
  BarChart, 
  Mail, 
  MapPin,
  Zap,
  Search
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    { 
      question: "HOW DO I SUBMIT A RECORD ATTEMPT?", 
      answer: "The first step is to create an athlete profile. Once registered, navigate to 'Submit a Record', select your category, and upload your high-definition video evidence along with biometric logs (heart rate/GPS). Our adjudicators will review your submission within 7-10 business days." 
    },
    { 
      question: "WHAT ARE THE BIOMETRIC REQUIREMENTS?", 
      answer: "To ensure absolute performance integrity, we require heart rate strap data for all endurance and strength records. Outdoor records must include verified GPS tracking from a Rogue-certified device or application." 
    },
    { 
      question: "HOW MUCH DOES OFFICIAL CERTIFICATION COST?", 
      answer: "Digital certification is included with all elite memberships. Physical certificates, etched on laser-cut brushed aluminum, are available for $120.00 including global shipping." 
    },
    { 
      question: "CAN I CHALLENGE AN EXISTING RECORD?", 
      answer: "Yes. Every record on the Rogue Global Ledger is open to challenge. You must meet the same biometric and evidence standards as the original record holder to be considered for the ranking." 
    },
    { 
      question: "HOW DO DIVISIONS WORK?", 
      answer: "We categorize records by age, weight class, and professional status. This ensures that a 12-year-old prodigy isn't competing against a 30-year-old pro, keeping the global leaderboard fair and competitive." 
    }
  ];

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
        
        {/* NAVBAR */}
        <Navbar />

        <div style={{ padding: "180px 5% 120px", flex: 1 }}>
        
        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", maxWidth: "1200px", margin: "0 auto 80px" }}>
          <div>
            <h3 style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "12px", textTransform: "uppercase" }}>SUPPORT CENTER</h3>
            <h1 style={{ fontSize: "72px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.9" }}>FAQ | ROGUE WORLD <br /> RECORDS</h1>
          </div>
          <Link to="/verify" style={{ textDecoration: "none" }}>
            <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "14px 32px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
              SUBMIT A RECORD <ArrowRight size={16} />
            </button>
          </Link>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>
          
          {/* LEFT: FAQ ACCORDION & GRID */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* RECORD SUBMISSIONS */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                <ShieldCheck size={20} color="#FF6A00" />
                <span style={{ fontSize: "14px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "0.05em" }}>RECORD SUBMISSIONS</span>
              </div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {faqs.map((faq, i) => (
                  <div key={i} style={{ borderBottom: i === faqs.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)", paddingBottom: "24px" }}>
                    <button 
                      onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                      style={{ width: "100%", background: "none", border: "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", textAlign: "left", padding: "0" }}
                    >
                      <span style={{ fontSize: "16px", fontWeight: "900", color: openIndex === i ? "#FF6A00" : "white", textTransform: "uppercase" }}>{faq.question}</span>
                      {openIndex === i ? <Minus size={18} color="#FF6A00" /> : <Plus size={18} color="rgba(255,255,255,0.2)" />}
                    </button>
                    {openIndex === i && (
                      <p style={{ marginTop: "16px", fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* SMALL GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <Clock size={18} color="#FF6A00" />
                  <span style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}>APPROVAL TIMES</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span style={{ color: "rgba(255,255,255,0.4)" }}>Standard</span> <span>7 Days</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span style={{ color: "rgba(255,255,255,0.4)" }}>Priority</span> <span>3 Days</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "800", color: "#FF6A00" }}><span>Express</span> <span>24 Hours</span></div>
                </div>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <CreditCard size={18} color="#FF6A00" />
                  <span style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}>SUBMISSION FEES</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span style={{ color: "rgba(255,255,255,0.4)" }}>7 Days</span> <span>$30</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}><span style={{ color: "rgba(255,255,255,0.4)" }}>3 Days</span> <span>$15</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: "800", color: "#FF6A00" }}><span>24 Hours</span> <span>$25</span></div>
                </div>
              </div>
            </div>

            {/* LOWER GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
                <Zap size={20} color="#FF6A00" style={{ marginBottom: "16px" }} />
                <h4 style={{ fontSize: "14px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>COMPETITION & CHALLENGES</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
                  Can I challenge a record? Yes. Anyone can challenge a record, but official review requires a submission fee.<br/><br/>
                  Can my record be challenged? Yes. All records are open to challenge and may need to be defended.
                </p>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
                <BarChart size={20} color="#FF6A00" style={{ marginBottom: "16px" }} />
                <h4 style={{ fontSize: "14px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>RANKINGS & REWARDS</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
                  How do rankings work? Points for setting/defending records and winning challenges.<br/><br/>
                  What happens if I break a record? You become the record holder, record is published, appear on leaderboard, can purchase certificates.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: MEMBERSHIP & CERTIFICATES */}
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* MEMBERSHIP CARD */}
            <div style={{ background: "#FF6A00", borderRadius: "32px", padding: "40px", color: "white" }}>
              <h4 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase", marginBottom: "20px" }}>MEMBERSHIP</h4>
              <p style={{ fontSize: "14px", fontWeight: "600", lineHeight: "1.6", marginBottom: "32px", opacity: 0.9 }}>
                Do I need a membership? No, membership is not required to submit a record. Membership is required for prize money, paid competitions, and elite features.
              </p>
              <button style={{ width: "100%", background: "#000", color: "white", border: "none", borderRadius: "16px", padding: "18px", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer" }}>
                GET ELITE ACCESS
              </button>
            </div>

            {/* CERTIFICATES */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,106,0,0.2)", borderRadius: "32px", padding: "40px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                <Trophy size={20} color="#FF6A00" />
                <span style={{ fontSize: "14px", fontWeight: "950", textTransform: "uppercase" }}>CERTIFICATES</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {[
                  { label: "DIGITAL", price: "$10" },
                  { label: "MAILED", price: "$30" },
                  { label: "FRAMED", price: "$45" }
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "16px 20px", background: "rgba(255,255,255,0.02)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
                    <span style={{ fontSize: "14px", fontWeight: "950" }}>{item.price}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FINANCIAL POLICIES */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
              <div style={{ width: "32px", height: "32px", background: "rgba(255,106,0,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                <CreditCard size={16} color="#FF6A00" />
              </div>
              <h4 style={{ fontSize: "14px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>FINANCIAL POLICIES</h4>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
                How do I compete for money? To compete for prize money, you must become a Certified Rogue Member.<br/><br/>
                Are submission fees refundable? No. Fees are for review services and are non-refundable once review begins.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM LINKS */}
        <div style={{ maxWidth: "1200px", margin: "80px auto 0", display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "24px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "40px" }}>
             <h4 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase", marginBottom: "24px" }}>STILL HAVE <br/> QUESTIONS?</h4>
             <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: "700" }}>
                 <Mail size={16} color="#FF6A00" /> support@rogueworldrecords.com
               </div>
               <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", fontWeight: "700" }}>
                 <MapPin size={16} color="#FF6A00" /> Visit our full Contact Page
               </div>
             </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Link to="/explore" style={{ textDecoration: "none" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "20px", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "900", color: "#FF6A00", marginBottom: "4px" }}>EXPLORE NOW</div>
                  <div style={{ fontSize: "20px", fontWeight: "950" }}>EXPLORE ALL RECORDS</div>
                </div>
                <ArrowRight size={24} />
              </div>
            </Link>
            <Link to="/challenge" style={{ textDecoration: "none" }}>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: "20px", padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "10px", fontWeight: "900", color: "#FF6A00", marginBottom: "4px" }}>TAKE THE THRONE</div>
                  <div style={{ fontSize: "20px", fontWeight: "950" }}>CHALLENGE A RECORD</div>
                </div>
                <Zap size={24} />
              </div>
            </Link>
          </div>
        </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default FAQ;
