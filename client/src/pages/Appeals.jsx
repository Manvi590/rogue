import React, { useState } from "react";
import { 
  ArrowRight, 
  FileText, 
  UploadCloud, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  Shield,
  Clock,
  Users,
  Search,
  Scale,
  Zap,
  Mail,
  ChevronRight,
  Info,
  Calendar,
  Flag,
  FileCheck,
  ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import GlowCard from "../components/GlowCard";

const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div style={{ marginBottom: "40px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#FF6A00", marginBottom: "8px" }}>
      {Icon && <Icon size={20} />}
      <span style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", textTransform: "uppercase" }}>{subtitle}</span>
    </div>
    <h2 style={{ fontSize: "32px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.02em" }}>{title}</h2>
  </div>
);

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "12px",
  padding: "16px 20px",
  color: "white",
  fontSize: "14px",
  outline: "none",
  transition: "all 0.3s ease"
};

const labelStyle = {
  display: "block",
  fontSize: "11px",
  fontWeight: "900",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.4)",
  marginBottom: "12px",
  letterSpacing: "0.05em"
};

const Appeals = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    dob: "",
    email: "",
    phone: "",
    country: "",
    submissionId: "",
    recordTitle: "",
    category: "",
    submissionDate: "",
    denialDate: "",
    appealReason: "",
    otherReason: "",
    explanation: "",
    evidence: [],
    witnessName: "",
    witnessContact: "",
    witnessStatement: "",
    declaration: false,
    signature: "",
    date: new Date().toISOString().split('T')[0]
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.declaration) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <AppealsStyles />

        {/* HERO SECTION */}
        <section style={{ padding: "180px 5% 100px", background: "linear-gradient(180deg, #111 0%, #0A0A0A 100%)", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", top: "-10%", left: "-10%", width: "40%", height: "40%", background: "radial-gradient(circle, rgba(255,106,0,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
          
          <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(255,106,0,0.1)", padding: "8px 20px", borderRadius: "100px", border: "1px solid rgba(255,106,0,0.2)", marginBottom: "32px" }}>
                <Scale size={16} color="#FF6A00" />
                <span style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.2em", textTransform: "uppercase" }}>Justice & Integrity</span>
              </div>
              <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.9", marginBottom: "32px" }}>
                APPEAL APPLICATION <br/>
                <span style={{ color: "#FF6A00" }}>PROCESS</span>
              </h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
                At Rogue World Records, fairness and transparency are important to us. If you believe your submission was denied unfairly, you may file an official appeal for reconsideration.
              </p>
            </motion.div>
          </div>
        </section>

        {/* PROCEDURE OVERVIEW */}
        <section style={{ padding: "100px 5%", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", marginBottom: "100px" }}>
            {[
              { step: "01", title: "Complete Form", desc: "Fill out the official Appeal Application Form with all required details and disputes.", icon: <FileText size={32} /> },
              { step: "02", title: "Submit Evidence", desc: "Upload corrected video, photos, witness statements, or timing documents.", icon: <UploadCloud size={32} /> },
              { step: "03", title: "Secondary Review", desc: "Senior verification staff and technical reviewers re-examine your submission.", icon: <Search size={32} /> },
              { step: "04", title: "Final Decision", desc: "Receive a formal outcome: Approved, Partially Approved, or Denied.", icon: <CheckCircle size={32} /> }
            ].map((item, idx) => (
              <ScrollReveal key={idx}>
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", padding: "48px", borderRadius: "32px", position: "relative", overflow: "hidden", height: "100%" }}>
                  <div style={{ position: "absolute", top: "-10px", right: "-10px", fontSize: "100px", fontWeight: "950", color: "rgba(255,106,0,0.03)", pointerEvents: "none" }}>{item.step}</div>
                  <div style={{ color: "#FF6A00", marginBottom: "24px" }}>{item.icon}</div>
                  <h3 style={{ fontSize: "20px", fontWeight: "900", textTransform: "uppercase", marginBottom: "16px" }}>{item.title}</h3>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "flex-start" }}>
            {/* WHO & WHY */}
            <div>
              <ScrollReveal>
                <div style={{ marginBottom: "60px" }}>
                  <SectionTitle icon={Users} subtitle="Eligibility" title="Who Can Appeal?" />
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                    {["Record Applicants", "Team Leaders", "Coaches/Guardians", "Official Event Reps"].map(tag => (
                      <div key={tag} style={{ background: "rgba(255,106,0,0.1)", color: "#FF6A00", padding: "10px 20px", borderRadius: "12px", fontSize: "12px", fontWeight: "800", border: "1px solid rgba(255,106,0,0.2)" }}>{tag.toUpperCase()}</div>
                    ))}
                  </div>
                  <p style={{ marginTop: "24px", color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>* Appeals must come from the original account associated with the submission.</p>
                </div>

                <div style={{ marginBottom: "60px" }}>
                  <SectionTitle icon={Info} subtitle="Categories" title="Reasons for Appeal" />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {[
                      "Missing evidence", "Technical upload problems", "Incorrect measurements", "Rule misunderstandings", 
                      "Disqualification disputes", "Timing/Scoring disputes", "Judging errors", "Identity concerns"
                    ].map((reason, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
                        <div style={{ width: "6px", height: "6px", background: "#FF6A00", borderRadius: "50%" }} /> {reason}
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* TIMELINE & RULES */}
            <div>
              <ScrollReveal>
                <GlowCard glowColor="orange" style={{ marginBottom: "32px" }}>
                  <div style={{ padding: "40px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                      <Clock size={32} color="#FF6A00" />
                      <div>
                        <h4 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase" }}>30 DAYS TIMELINE</h4>
                        <p style={{ fontSize: "12px", color: "#FF6A00", fontWeight: "800", letterSpacing: "0.1em" }}>FROM DATE OF DECISION</p>
                      </div>
                    </div>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
                      Appeals must be submitted within 30 days of the original denial. Applications submitted after this deadline will not be accepted.
                    </p>
                  </div>
                </GlowCard>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "32px", padding: "40px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#FF6A00", marginBottom: "16px" }}>
                    <Shield size={20} />
                    <span style={{ fontSize: "12px", fontWeight: "900", letterSpacing: "0.1em" }}>IMPORTANT RULES</span>
                  </div>
                  <ul style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.8", paddingLeft: "20px" }}>
                    <li>Must be truthful and include legitimate evidence.</li>
                    <li>Remain respectful toward staff and judges.</li>
                    <li>Fraudulent evidence results in permanent termination.</li>
                    <li>Edited/manipulated footage is strictly prohibited.</li>
                  </ul>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* THE FORM SECTION */}
        <section id="appeal-form" style={{ padding: "100px 5% 160px", background: "#0F0F0F" }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
            <ScrollReveal>
              <div style={{ textAlign: "center", marginBottom: "80px" }}>
                <h2 style={{ fontSize: "48px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>APPEAL APPLICATION <span style={{ color: "#FF6A00" }}>FORM</span></h2>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Please complete all required sections for a formal review.</p>
              </div>
            </ScrollReveal>

            {success ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid #FF6A00", borderRadius: "40px", padding: "80px 40px", textAlign: "center" }}>
                  <div style={{ width: "100px", height: "100px", background: "rgba(255,106,0,0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px", border: "2px solid #FF6A00" }}>
                    <CheckCircle size={50} color="#FF6A00" />
                  </div>
                  <h3 style={{ fontSize: "32px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>SUBMITTED SUCCESSFULLY</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", maxWidth: "600px", margin: "0 auto 40px", lineHeight: "1.6" }}>
                    Your appeal has been received and indexed. A confirmation email with your tracking number has been sent to your registered address.
                  </p>
                  <button onClick={() => setSuccess(false)} style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px 48px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", transition: "0.3s" }}>RETURN TO FORM</button>
                </motion.div>
              ) : (
                <div style={{ background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "40px", overflow: "hidden", boxShadow: "0 50px 100px rgba(0,0,0,0.5)" }}>
                  <div style={{ background: "rgba(255,255,255,0.02)", padding: "30px 50px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "24px" }}>
                      {[1, 2, 3, 4, 5].map(s => (
                        <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{ 
                            width: "28px", 
                            height: "28px", 
                            borderRadius: "50%", 
                            background: step >= s ? "#FF6A00" : "rgba(255,255,255,0.05)", 
                            color: step >= s ? "white" : "rgba(255,255,255,0.2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "12px",
                            fontWeight: "900",
                            transition: "0.3s"
                          }}>{s}</div>
                          {s < 5 && <div style={{ width: "20px", height: "1px", background: "rgba(255,255,255,0.05)" }} />}
                        </div>
                      ))}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "900", color: "rgba(255,255,255,0.4)" }}>SECTION {step} OF 5</div>
                  </div>

                  <form onSubmit={handleSubmit} style={{ padding: "60px 80px" }}>
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <SectionTitle subtitle="Applicant Details" title="Personal Information" icon={Users} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                            <div className="form-group">
                              <label style={labelStyle}>Full Legal Name</label>
                              <input type="text" name="fullName" style={inputStyle} value={formData.fullName} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Username / Account ID</label>
                              <input type="text" name="username" style={inputStyle} value={formData.username} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Date of Birth</label>
                              <input type="date" name="dob" style={inputStyle} value={formData.dob} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Email Address</label>
                              <input type="email" name="email" style={inputStyle} value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Phone Number</label>
                              <input type="tel" name="phone" style={inputStyle} value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Country</label>
                              <input type="text" name="country" style={inputStyle} value={formData.country} onChange={handleChange} required />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <SectionTitle subtitle="Original Request" title="Submission Information" icon={ClipboardList} />
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                            <div className="form-group">
                              <label style={labelStyle}>Original Submission ID</label>
                              <input type="text" name="submissionId" style={inputStyle} value={formData.submissionId} onChange={handleChange} required placeholder="RWR-XXXXX" />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Record Title / Challenge</label>
                              <input type="text" name="recordTitle" style={inputStyle} value={formData.recordTitle} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Record Category</label>
                              <input type="text" name="category" style={inputStyle} value={formData.category} onChange={handleChange} required />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Submission Date</label>
                              <input type="date" name="submissionDate" style={inputStyle} value={formData.submissionDate} onChange={handleChange} required />
                            </div>
                            <div className="form-group" style={{ gridColumn: "span 2" }}>
                              <label style={labelStyle}>Date of Decision or Denial</label>
                              <input type="date" name="denialDate" style={inputStyle} value={formData.denialDate} onChange={handleChange} required />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <SectionTitle subtitle="Case Context" title="Appeal Type & Details" icon={Zap} />
                          <div style={{ marginBottom: "30px" }}>
                            <label style={labelStyle}>Select the Reason for Appeal</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                              {[
                                "Incorrect Verification Decision", "Video or Evidence Issue", "Timing or Measurement Dispute", 
                                "Rule Interpretation Dispute", "Disqualification Appeal", "Technical Upload Error", 
                                "Missing Evidence Submission", "Judge Review Request", "Identity Verification Issue", "Other"
                              ].map(reason => (
                                <label key={reason} style={{ display: "flex", alignItems: "center", gap: "12px", background: formData.appealReason === reason ? "rgba(255,106,0,0.1)" : "rgba(255,255,255,0.02)", border: formData.appealReason === reason ? "1px solid #FF6A00" : "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px 20px", cursor: "pointer", transition: "0.3s" }}>
                                  <input type="radio" name="appealReason" value={reason} checked={formData.appealReason === reason} onChange={handleChange} style={{ accentColor: "#FF6A00" }} />
                                  <span style={{ fontSize: "14px", fontWeight: "600", color: formData.appealReason === reason ? "white" : "rgba(255,255,255,0.5)" }}>{reason}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          <div className="form-group">
                            <label style={labelStyle}>Detailed Appeal Explanation</label>
                            <textarea name="explanation" rows="6" style={inputStyle} value={formData.explanation} onChange={handleChange} placeholder="Please explain why you believe the decision should be reconsidered..." required></textarea>
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <SectionTitle subtitle="Verification" title="Evidence & Witnesses" icon={FileCheck} />
                          <div style={{ marginBottom: "40px" }}>
                            <label style={labelStyle}>Witness Information (Optional)</label>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
                              <input type="text" name="witnessName" placeholder="Witness Full Name" style={inputStyle} value={formData.witnessName} onChange={handleChange} />
                              <input type="text" name="witnessContact" placeholder="Witness Contact Info" style={inputStyle} value={formData.witnessContact} onChange={handleChange} />
                            </div>
                            <textarea name="witnessStatement" rows="4" placeholder="Witness Statement..." style={inputStyle} value={formData.witnessStatement} onChange={handleChange}></textarea>
                          </div>
                          
                          <label style={labelStyle}>Upload Supporting Documents (MP4, MOV, JPG, PNG, PDF)</label>
                          <div style={{ background: "rgba(255,106,0,0.05)", border: "1px dashed #FF6A00", borderRadius: "20px", padding: "60px", textAlign: "center", cursor: "pointer" }}>
                            <UploadCloud size={48} color="#FF6A00" style={{ margin: "0 auto 16px" }} />
                            <p style={{ fontWeight: "800", color: "#FF6A00" }}>DRAG & DROP FILES OR BROWSE</p>
                            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", marginTop: "8px" }}>Max File Size: 500MB</p>
                          </div>
                        </motion.div>
                      )}

                      {step === 5 && (
                        <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <SectionTitle subtitle="Confirmation" title="Final Declaration" icon={Shield} />
                          <div style={{ background: "rgba(255,106,0,0.05)", border: "1px solid rgba(255,106,0,0.2)", borderRadius: "24px", padding: "40px", marginBottom: "40px" }}>
                             <ul style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: "1.8", paddingLeft: "20px" }}>
                               <li>I confirm that all information provided is truthful and accurate.</li>
                               <li>I understand that fraudulent submissions result in permanent account termination.</li>
                               <li>I acknowledge that the secondary review decision is final and binding.</li>
                             </ul>
                             <label style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "32px", cursor: "pointer" }}>
                               <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} required style={{ width: "20px", height: "20px", accentColor: "#FF6A00" }} />
                               <span style={{ fontWeight: "700" }}>I AGREE TO THE ABOVE TERMS</span>
                             </label>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                            <div className="form-group">
                              <label style={labelStyle}>Applicant Digital Signature</label>
                              <input type="text" name="signature" style={inputStyle} value={formData.signature} onChange={handleChange} required placeholder="TYPE FULL LEGAL NAME" />
                            </div>
                            <div className="form-group">
                              <label style={labelStyle}>Date of Signature</label>
                              <input type="date" style={inputStyle} value={formData.date} readOnly />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div style={{ marginTop: "60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      {step > 1 ? (
                        <button type="button" onClick={prevStep} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "white", padding: "16px 32px", borderRadius: "100px", cursor: "pointer", fontWeight: "900", textTransform: "uppercase", fontSize: "12px" }}>BACK</button>
                      ) : <div />}
                      
                      {step < 5 ? (
                        <button type="button" onClick={nextStep} style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "16px 40px", fontSize: "13px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
                          NEXT SECTION <ChevronRight size={18} />
                        </button>
                      ) : (
                        <button type="submit" disabled={loading || !formData.declaration} style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "20px 60px", fontSize: "15px", fontWeight: "900", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "12px", opacity: formData.declaration ? 1 : 0.5 }}>
                          {loading ? "PROCESSING..." : "SUBMIT OFFICIAL APPEAL"} {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            

     
            
          </div>
        </section>

        {/* OUR COMMITMENT SECTION - ORANGE CTA STYLE */}
        <section style={{ padding: "100px 5% 160px" }}>
          <div className="orange-cta" style={{ maxWidth: "1200px", margin: "0 auto", borderRadius: "40px" }}>
            <div className="orange-cta-bg" />
            <div className="orange-cta-grid" />
            <div className="orange-cta-glow" />

            <div className="orange-cta-content" style={{ textAlign: "center" }}>
              <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.2)", padding: "12px", borderRadius: "50%", marginBottom: "32px", border: "1px solid rgba(255,255,255,0.3)" }}>
                 <Shield size={32} color="white" />
              </div>
              <h2 className="orange-cta-title" style={{ fontSize: "clamp(36px, 6vw, 70px)", fontWeight: "950", textTransform: "uppercase", marginBottom: "20px", letterSpacing: "-0.03em" }}>
                OUR <span className="orange-cta-highlight">COMMITMENT</span>
              </h2>
              <p className="orange-cta-subtitle" style={{ maxWidth: "800px", margin: "0 auto 40px", fontSize: "18px", color: "rgba(255,255,255,0.9)", lineHeight: "1.6" }}>
                We understand the hard work, training, and dedication competitors invest into their attempts. Our goal is to provide fair reviews, honest evaluations, and transparent communication while protecting the integrity of every verified achievement.
              </p>
              
              <div style={{ display: "flex", justifyContent: "center", gap: "40px", position: "relative", zIndex: 5 }}>
                 <div>
                   <div style={{ fontSize: "36px", fontWeight: "950", color: "white" }}>7–30</div>
                   <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase" }}>Business Days Review</div>
                 </div>
                 <div style={{ width: "1px", background: "rgba(255,255,255,0.3)" }} />
                 <div>
                   <div style={{ fontSize: "36px", fontWeight: "950", color: "white" }}>FINAL</div>
                   <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase" }}>Official Adjudication</div>
                 </div>
              </div>

              <div style={{ marginTop: "60px", position: "relative", zIndex: 5 }}>
                <p style={{ fontSize: "20px", fontWeight: "950", color: "white", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  Break Limits. Make History. Become Legendary.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section style={{ padding: "80px 5%", background: "linear-gradient(to bottom, #0F0F0F, #0A0A0A)" }}>
           <div style={{ maxWidth: "1200px", margin: "0 auto", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "40px", padding: "60px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "40px" }}>
              <div>
                <h4 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase", marginBottom: "12px" }}>SUBMISSION INSTRUCTIONS</h4>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>Completed your application offline? Submit via official channels.</p>
              </div>
              <div style={{ display: "flex", gap: "20px" }}>
                <a href="mailto:appeals@rogueworldrecords.com" style={{ background: "rgba(255,106,0,0.1)", color: "#FF6A00", textDecoration: "none", padding: "20px 40px", borderRadius: "100px", fontWeight: "900", fontSize: "14px", display: "flex", alignItems: "center", gap: "12px", border: "1px solid rgba(255,106,0,0.2)" }}>
                   <Mail size={18} /> APPEALS@ROGUENETWORK.COM
                </a>
              </div>
           </div>
        </section>

        <Footer />
      </div>
      
      
    </PageTransition>
  );
};

const AppealsStyles = () => (
  <style>{`
    input::placeholder, textarea::placeholder {
      color: rgba(255,255,255,0.2);
    }
    input:focus, textarea:focus {
      border-color: #FF6A00 !important;
      background: rgba(255,106,0,0.02) !important;
    }
  `}</style>
);

export default Appeals;
