import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  User, 
  IdCard, 
  Globe, 
  Dumbbell, 
  Timer, 
  Zap, 
  Crosshair,
  MapPin,
  ClipboardCheck,
  Video,
  Camera,
  BarChart3,
  CheckCircle2,
  Lock,
  Cpu,
  Activity,
  Maximize2,
  Scan
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Verify = () => {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    fullName: "",
    athleteId: "",
    country: "UNITED STATES",
    category: "STRENGTH",
    event: "Log Press (Max Weight)",
    venueName: "",
    city: "",
    witnessName: "",
    witnessCredentials: ""
  });

  const nextStep = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (step === 1) return formData.fullName.trim().length > 2 && formData.athleteId.trim().length > 5;
    if (step === 2) return formData.category !== "" && formData.event !== "";
    if (step === 3) return formData.venueName.trim() !== "" && formData.city.trim() !== "" && formData.witnessName.trim() !== "";
    return true;
  };

  // SUCCESS PAGE
  const SuccessPage = () => (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ textAlign: "center", padding: "60px 20px" }}
    >
      <div style={{ width: "120px", height: "120px", background: "rgba(74, 222, 128, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px", border: "2px solid #4ADE80" }}>
        <CheckCircle2 size={60} color="#4ADE80" />
      </div>
      <h1 style={{ fontSize: "clamp(32px, 6vw, 56px)", fontWeight: "950", textTransform: "uppercase", marginBottom: "20px" }}>SUBMITTED <span style={{ color: "#FF6A00" }}>SUCCESSFULLY</span></h1>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "18px", maxWidth: "600px", margin: "0 auto 40px", lineHeight: "1.6" }}>
        Your record attempt has been indexed in our secure ledger. Our global adjudication team will now begin the final biometric audit and evidence review.
      </p>
      <Link to="/" style={{ textDecoration: "none" }}>
        <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px 48px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "12px", margin: "0 auto", boxShadow: "0 20px 40px rgba(255,106,0,0.2)" }}>
          <Globe size={18} /> RETURN TO HOME BASE
        </button>
      </Link>
    </motion.div>
  );

  // STEP 1: ESTABLISH IDENTITY
  const Step1 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ width: "100%", maxWidth: "100%", margin: "0 auto" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h3 style={{ color: "#FF6A00", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "10px" }}>PHASE 01</h3>
          <h1 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.02em" }}>ESTABLISH IDENTITY</h1>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>STEP 1 OF 6</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>FULL LEGAL NAME</label>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="AS APPEARS ON PASSPORT" 
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 24px", color: "white", fontSize: "14px", outline: "none", transition: "border-color 0.3s" }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>ATHLETE ID</label>
          <div style={{ position: "relative" }}>
            <input 
              type="text" 
              placeholder="RWR-XXXX-XXXX" 
              style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 24px", color: "white", fontSize: "14px", outline: "none" }}
            />
            <div style={{ position: "absolute", right: "20px", top: "50%", transform: "translateY(-50%)", color: "#FF6A00" }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>COUNTRY OF ORIGIN</label>
          <select style={{ width: "100%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "18px 24px", color: "white", fontSize: "14px", outline: "none", appearance: "none" }}>
            <option>UNITED STATES</option>
            <option>UNITED KINGDOM</option>
            <option>GERMANY</option>
          </select>
        </div>

        {/* VERIFICATION PROTOCOL BOX */}
        <div style={{ background: "rgba(255, 106, 0, 0.03)", border: "1px solid rgba(255, 106, 0, 0.2)", borderRadius: "24px", padding: "24px", marginTop: "20px" }}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
            <Shield size={20} color="#FF6A00" />
            <span style={{ fontSize: "12px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.1em" }}>VERIFICATION PROTOCOL</span>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
            Identity must be confirmed via our <span style={{ color: "white", fontWeight: "700" }}>Biometric Audit Engine</span>. This process ensures the integrity of the World Record leaderboard by cryptographically linking your physical performance to your verified athlete profile.
          </p>
          <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "8px", color: "#FF6A00", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}>
            <div style={{ width: "6px", height: "6px", background: "#FF6A00", borderRadius: "50%" }}></div> LEARN MORE
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "40px" }}>
          <button 
            onClick={nextStep}
            disabled={!isStepValid()}
            style={{ 
              background: isStepValid() ? "#FF6A00" : "rgba(255,255,255,0.05)", 
              color: isStepValid() ? "white" : "rgba(255,255,255,0.2)", 
              border: "none", 
              borderRadius: "100px", 
              padding: "16px 40px", 
              fontSize: "14px", 
              fontWeight: "900", 
              textTransform: "uppercase", 
              cursor: isStepValid() ? "pointer" : "not-allowed", 
              display: "flex", 
              alignItems: "center", 
              gap: "10px", 
              boxShadow: isStepValid() ? "0 20px 40px rgba(255, 106, 0, 0.2)" : "none",
              transition: "all 0.3s"
            }}
          >
            NEXT STEP <ArrowRight size={18} />
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "10px" }}>
          DATA ENCRYPTED WITH 256-BIT MILITARY GRADE SECURITY
        </p>
      </div>
    </motion.div>
  );

  // STEP 2: DEFINE ACHIEVEMENT
  const Step2 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h3 style={{ color: "#FF6A00", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "10px" }}>PHASE 02</h3>
          <h1 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.02em" }}>DEFINE ACHIEVEMENT</h1>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>STEP 2 OF 6</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "40px" }}>
        {/* LEFT: CATEGORIES */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {[
            { id: "strength", label: "STRENGTH", icon: <Dumbbell size={24} />, desc: "Powerlifting, Strongman, and explosive weight disciplines." },
            { id: "endurance", label: "ENDURANCE", icon: <Timer size={24} />, desc: "Ultra-marathons, cycling, and long-form cardio feats." },
            { id: "agility", label: "AGILITY", icon: <Zap size={24} />, desc: "Obstacle courses, parkour, and speed-based precision." },
            { id: "combat", label: "COMBAT", icon: <Crosshair size={24} />, desc: "Strike counts, grappling duration, and martial arts feats." }
          ].map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => setFormData({...formData, category: cat.label})}
              style={{ 
                background: formData.category === cat.label ? "rgba(255,106,0,0.1)" : "rgba(255,255,255,0.03)", 
                border: formData.category === cat.label ? "1px solid #FF6A00" : "1px solid rgba(255,255,255,0.08)", 
                borderRadius: "24px", 
                padding: "24px", 
                cursor: "pointer", 
                transition: "all 0.3s" 
              }}
            >
              <div style={{ color: "#FF6A00", marginBottom: "16px" }}>{cat.icon}</div>
              <h4 style={{ fontSize: "18px", fontWeight: "900", marginBottom: "10px" }}>{cat.label}</h4>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.5", marginBottom: "16px" }}>{cat.desc}</p>
              <div style={{ fontSize: "11px", fontWeight: "900", color: "#FF6A00", display: "flex", alignItems: "center", gap: "4px" }}>
                {formData.category === cat.label ? "SELECTED" : "SELECT"} <span style={{ fontSize: "14px" }}>{formData.category === cat.label ? "✓" : "+"}</span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: SPECIFIC EVENT */}
        <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            <div style={{ width: "2px", height: "14px", background: "#FF6A00" }}></div>
            <span style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em" }}>SELECT SPECIFIC EVENT</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Deadlift (1RM)", "Log Press (Max Weight)", "Atlas Stone Load", "Farmer's Walk (Distance)"].map((event, idx) => (
              <div 
                key={idx} 
                onClick={() => setFormData({...formData, event})}
                style={{ 
                  padding: "16px 20px", 
                  background: formData.event === event ? "rgba(255,106,0,0.05)" : "transparent", 
                  border: formData.event === event ? "1px solid rgba(255,106,0,0.3)" : "1px solid rgba(255,255,255,0.05)", 
                  borderRadius: "12px", 
                  fontSize: "13px", 
                  fontWeight: "700", 
                  cursor: "pointer", 
                  color: formData.event === event ? "white" : "rgba(255,255,255,0.6)",
                  transition: "all 0.2s"
                }}
              >
                {event}
              </div>
            ))}
          </div>

          <div style={{ marginTop: "60px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>CURRENT RECORD</span>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "32px", fontWeight: "950", color: "white" }}>185KG</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "600" }}>Set by D. Miller (2023)</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <button onClick={prevStep} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <ArrowLeft size={16} /> PREVIOUS STEP
        </button>
        <button 
          onClick={nextStep} 
          disabled={!isStepValid()}
          style={{ 
            background: isStepValid() ? "#FF6A00" : "rgba(255,255,255,0.05)", 
            color: isStepValid() ? "white" : "rgba(255,255,255,0.2)", 
            border: "none", 
            borderRadius: "100px", 
            padding: "16px 40px", 
            fontSize: "14px", 
            fontWeight: "900", 
            textTransform: "uppercase", 
            cursor: isStepValid() ? "pointer" : "not-allowed", 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            boxShadow: isStepValid() ? "0 20px 40px rgba(255, 106, 0, 0.2)" : "none",
            transition: "all 0.3s"
          }}
        >
          NEXT STEP <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  // STEP 3: ENVIRONMENT VALIDATION
  const Step3 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h3 style={{ color: "#FF6A00", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "10px" }}>PHASE 03</h3>
          <h1 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.02em" }}>ENVIRONMENT VALIDATION</h1>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>STEP 3 OF 6</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "40px" }}>
        {/* LEFT: IMAGE & PROTOCOL */}
        <div>
          <div style={{ width: "100%", height: "450px", borderRadius: "24px", overflow: "hidden", marginBottom: "24px" }}>
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" alt="Venue" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
            <Shield size={20} color="#FF6A00" style={{ marginTop: "4px" }} />
            <div>
              <div style={{ fontSize: "11px", fontWeight: "900", color: "#FF6A00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>AUTHENTICITY PROTOCOL</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
                Every record requires a sanctioned environment and verified witness testimony to enter the Rogue archives.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: FORMS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* VENUE ID */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px", alignItems: "center" }}>
              <MapPin size={18} color="#FF6A00" />
              <span style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>VENUE IDENTIFICATION</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "10px", textTransform: "uppercase" }}>VENUE NAME</label>
                <input 
                  type="text" 
                  placeholder="E.G., ROGUE HQ PERFORMANCE CENTER" 
                  value={formData.venueName}
                  onChange={(e) => setFormData({...formData, venueName: e.target.value})}
                  style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "14px 20px", color: "white", outline: "none" }} 
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "10px", textTransform: "uppercase" }}>CITY / REGION</label>
                  <input 
                    type="text" 
                    placeholder="COLUMBUS, OH" 
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "14px 20px", color: "white", outline: "none" }} 
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "10px", textTransform: "uppercase" }}>GPS COORDINATES (OPTIONAL)</label>
                  <div style={{ position: "relative" }}>
                    <input type="text" placeholder="39.9612° N, 82.9988° W" style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "14px 20px", color: "white", outline: "none" }} />
                    <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "#FF6A00" }}>
                      <Crosshair size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WITNESS CREDENTIALS */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px", alignItems: "center" }}>
              <ClipboardCheck size={18} color="#FF6A00" />
              <span style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>WITNESS CREDENTIALS</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "10px", textTransform: "uppercase" }}>WITNESS NAME</label>
                <input 
                  type="text" 
                  placeholder="FULL LEGAL NAME" 
                  value={formData.witnessName}
                  onChange={(e) => setFormData({...formData, witnessName: e.target.value})}
                  style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "14px 20px", color: "white", outline: "none" }} 
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "10px", textTransform: "uppercase" }}>PROFESSIONAL CREDENTIALS / TITLE</label>
                <textarea 
                  rows="3" 
                  placeholder="E.G., CERTIFIED STRENGTH COACH (CSCS), INTERNATIONAL POWERLIFTING FEDERATION REF" 
                  value={formData.witnessCredentials}
                  onChange={(e) => setFormData({...formData, witnessCredentials: e.target.value})}
                  style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "12px", padding: "14px 20px", color: "white", outline: "none", resize: "none" }}
                ></textarea>
              </div>
              <div style={{ display: "flex", gap: "12px", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Activity size={16} color="rgba(255,255,255,0.4)" />
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "600", lineHeight: "1.4" }}>
                  Witnesses may be contacted by Rogue World Records officials to verify the legitimacy of the performance environment and equipment calibration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <button onClick={prevStep} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <ArrowLeft size={16} /> PREVIOUS STEP
        </button>
        <button 
          onClick={nextStep} 
          disabled={!isStepValid()}
          style={{ 
            background: isStepValid() ? "#FF6A00" : "rgba(255,255,255,0.05)", 
            color: isStepValid() ? "white" : "rgba(255,255,255,0.2)", 
            border: "none", 
            borderRadius: "100px", 
            padding: "16px 40px", 
            fontSize: "14px", 
            fontWeight: "900", 
            textTransform: "uppercase", 
            cursor: isStepValid() ? "pointer" : "not-allowed", 
            display: "flex", 
            alignItems: "center", 
            gap: "10px", 
            boxShadow: isStepValid() ? "0 20px 40px rgba(255, 106, 0, 0.2)" : "none",
            transition: "all 0.3s"
          }}
        >
          NEXT STEP <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  // STEP 4: MEDIA EVIDENCE
  const Step4 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h3 style={{ color: "#FF6A00", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "10px" }}>PHASE 04</h3>
          <h1 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.02em" }}>MEDIA EVIDENCE</h1>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>STEP 4 OF 6</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
        {/* LEFT: PRIMARY VIDEO */}
        <div style={{ position: "relative", width: "100%", height: "480px", borderRadius: "32px", overflow: "hidden", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.2, filter: "grayscale(100%)" }}></div>
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ width: "80px", height: "80px", background: "#FF6A00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 32px" }}>
              <Video size={32} color="white" fill="white" />
            </div>
            <h2 style={{ fontSize: "28px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>PRIMARY VIDEO (UNCUT)</h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", maxWidth: "380px", margin: "0 auto 40px", lineHeight: "1.6" }}>
              Continuous footage starting from 1 minute prior to the attempt. Must include equipment verification.
            </p>
            <button style={{ background: "white", color: "black", border: "none", borderRadius: "100px", padding: "14px 32px", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", margin: "0 auto" }}>
              BROWSE FILES <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT: PHOTO & DATA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", position: "relative" }}>
            <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", position: "absolute", right: "32px", top: "32px" }}>MAX 250MB</div>
            <Camera size={24} color="#FF6A00" style={{ marginBottom: "20px" }} />
            <h4 style={{ fontSize: "18px", fontWeight: "900", textTransform: "uppercase", marginBottom: "10px" }}>PHOTO EVIDENCE</h4>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "20px" }}>High-resolution stills of equipment and finish line.</p>
            <div style={{ padding: "16px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", textAlign: "center", fontSize: "11px", fontWeight: "800", color: "rgba(255,255,255,0.2)", textTransform: "uppercase" }}>DROP IMAGES HERE</div>
          </div>

          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px", position: "relative" }}>
            <div style={{ fontSize: "10px", fontWeight: "900", color: "#FF6A00", position: "absolute", right: "32px", top: "32px", background: "rgba(255,106,0,0.1)", padding: "4px 10px", borderRadius: "100px" }}>REQUIRED</div>
            <BarChart3 size={24} color="#FF6A00" style={{ marginBottom: "20px" }} />
            <h4 style={{ fontSize: "18px", fontWeight: "900", textTransform: "uppercase", marginBottom: "10px" }}>TELEMETRY DATA LOG</h4>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "24px" }}>CSV or FIT files from certified tracking devices.</p>
            <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
              <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} style={{ height: "100%", background: "#FF6A00" }}></motion.div>
            </div>
            <div style={{ position: "absolute", right: "32px", bottom: "32px", opacity: 0.1 }}><BarChart3 size={40} /></div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "32px" }}>
        {[
          { icon: <CheckCircle2 size={16} />, text: "4K / 1080P RECOMMENDED" },
          { icon: <CheckCircle2 size={16} />, text: "NO CUTS OR EDITS" },
          { icon: <CheckCircle2 size={16} />, text: "GPS SYNC VERIFIED" }
        ].map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 24px", background: "rgba(255,255,255,0.03)", borderRadius: "16px", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}>
            <span style={{ color: "#FF6A00" }}>{item.icon}</span> {item.text}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <button onClick={prevStep} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <ArrowLeft size={16} /> PREVIOUS STEP
        </button>
        <button onClick={nextStep} style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "16px 40px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 20px 40px rgba(255, 106, 0, 0.2)" }}>
          NEXT STEP <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  // STEP 5: BIOMETRIC AUDIT
  const Step5 = () => (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
        <div>
          <h3 style={{ color: "#FF6A00", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "10px" }}>PHASE 05</h3>
          <h1 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", lineHeight: "0.9" }}>BIOMETRIC AUDIT</h1>
        </div>
        <div style={{ fontSize: "12px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>STEP 5 OF 6</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "32px" }}>
        {/* LEFT: SCANNING ACTIVE */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,106,0,0.2)" }}>
            <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80" alt="Biometric Audit" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)" }}></div>
            
            {/* OVERLAYS */}
            <div style={{ position: "absolute", left: "24px", top: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", color: "#FF6A00", letterSpacing: "0.1em" }}>
                <div style={{ width: "6px", height: "6px", background: "#FF6A00", borderRadius: "50%", animation: "pulse 1s infinite" }}></div> SCANNING_ACTIVE
              </div>
              <div style={{ fontSize: "18px", fontWeight: "900", marginTop: "12px" }}>FPS: 120.4</div>
            </div>
            
            <div style={{ position: "absolute", left: "24px", bottom: "24px" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "4px" }}>TRACKING IDENTITY</div>
              <div style={{ fontSize: "14px", fontWeight: "900" }}>ELITE_ATHLETE_#124</div>
            </div>
            
            <div style={{ position: "absolute", right: "24px", bottom: "24px", textAlign: "right" }}>
              <div style={{ fontSize: "10px", fontWeight: "800", color: "#FF6A00", textTransform: "uppercase", marginBottom: "4px" }}>CONFIDENCE SCORE</div>
              <div style={{ fontSize: "32px", fontWeight: "950" }}>98.4%</div>
            </div>

            {/* SCANNING LINE */}
            <motion.div 
              animate={{ top: ["20%", "80%", "20%"] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", left: "20px", right: "20px", height: "1px", background: "rgba(255,106,0,0.5)", boxShadow: "0 0 15px #FF6A00", zIndex: 3 }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "24px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden" }}>
               <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.2)", textTransform: "uppercase", marginBottom: "16px" }}>NEURAL MAP</div>
               <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "120px" }}>
                 <Scan size={60} color="#FF6A00" opacity={0.3} />
               </div>
               <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <Activity size={80} color="#FF6A00" opacity={0.1} />
               </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "32px" }}>
              <h4 style={{ fontSize: "20px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "0.02em" }}>AUTHENTICITY PROTOCOL_V4.2</h4>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: "1.7", marginBottom: "24px" }}>
                Our AI Vision Analysis scrutinizes 420 unique joint positions per second. By comparing your movement signature against the global standard for this record, we ensure the absolute integrity of the ROGUE ecosystem.
              </p>
              <div style={{ display: "flex", gap: "40px" }}>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: "950" }}>0.002S</div>
                  <div style={{ fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: "4px" }}>LATENCY</div>
                </div>
                <div>
                  <div style={{ fontSize: "22px", fontWeight: "950" }}>TERABYTE+</div>
                  <div style={{ fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginTop: "4px" }}>DATA_PARSED</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: STATUS REPORT */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,106,0,0.3)", borderRadius: "32px", padding: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <h4 style={{ fontSize: "20px", fontWeight: "950", textTransform: "uppercase" }}>STATUS REPORT</h4>
              <Shield size={20} color="#FF6A00" />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {[
                { label: "PARSING MOVEMENT", status: "COMPLETE" },
                { label: "AUTHENTICITY CHECK", status: "VERIFIED" },
                { label: "SPATIAL GEOMETRY", status: "99.2% MATCH" },
                { label: "FRAME SYNCING", status: "LOCKED" }
              ].map((item, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase" }}>{item.status}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "32px", background: "rgba(255,255,255,0.02)", padding: "16px", borderRadius: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "600", lineHeight: "1.5" }}>
                AI engine is currently reconciling multi-angle biometric signatures. System state: <span style={{ color: "white" }}>NOMINAL</span>.
              </p>
            </div>
          </div>

          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px", padding: "32px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
             <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.7", marginBottom: "32px" }}>
               Biometric validation is reaching terminal phase. Confirm data integrity to proceed to final record indexing.
             </p>
              <button onClick={nextStep} style={{ width: "100%", background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 20px 40px rgba(255, 106, 0, 0.2)" }}>
                CONFIRM VERIFICATION <ArrowRight size={18} />
              </button>
          </div>
        </div>
      </div>
      
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
        <button onClick={prevStep} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <ArrowLeft size={16} /> PREVIOUS STEP
        </button>
      </div>
    </motion.div>
  );

  return (
    <PageTransition>
      <div style={{ 
        background: "#0A0A0A", 
        color: "white", 
        minHeight: "100vh", 
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column"
      }}>
        <Navbar />

        <div style={{ 
          padding: "180px 5% 120px", 
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: isSubmitted ? "center" : "flex-start"
        }}>
        {/* GLOBAL PROGRESS BAR (TOP) */}
        <div style={{ position: "fixed", top: "0", left: "0", width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", zIndex: 100 }}>
          <motion.div 
            animate={{ width: `${(step / totalSteps) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{ height: "100%", background: "#FF6A00", boxShadow: "0 0 10px #FF6A00" }}
          />
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%" }}>
          <AnimatePresence mode="wait">
            {isSubmitted ? (
              <SuccessPage key="success" />
            ) : (
              <>
                {step === 1 && <Step1 key="step1" />}
                {step === 2 && <Step2 key="step2" />}
                {step === 3 && <Step3 key="step3" />}
                {step === 4 && <Step4 key="step4" />}
                {step === 5 && <Step5 key="step5" />}
                {step === 6 && (
              <motion.div 
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ width: "100%", maxWidth: "1000px", margin: "0 auto" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
                  <div>
                    <h3 style={{ color: "#FF6A00", fontSize: "11px", fontWeight: "900", letterSpacing: "0.15em", marginBottom: "10px", textTransform: "uppercase" }}>PHASE 06</h3>
                    <h1 style={{ fontSize: "42px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.02em" }}>FINAL LEDGER SUBMISSION</h1>
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>STEP 6 OF 6</div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "24px" }}>
                  {/* LEFT: VERIFIED RECORD DATA */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,106,0,0.2)", borderRadius: "32px", padding: "40px", position: "relative" }}>
                    <div style={{ position: "absolute", right: "40px", top: "40px" }}>
                      <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <CheckCircle2 size={32} color="#FF6A00" opacity={0.3} />
                      </div>
                    </div>
                    
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "48px" }}>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>ATHLETE</div>
                        <div style={{ fontSize: "20px", fontWeight: "900" }}>ELITE ATHLETE #124</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>CATEGORY</div>
                        <div style={{ fontSize: "20px", fontWeight: "900" }}>STRENGTH / LOG PRESS</div>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", marginBottom: "48px" }}>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>PERFORMANCE METRIC</div>
                        <div style={{ fontSize: "32px", fontWeight: "950", color: "#FF6A00" }}>185.0 KG</div>
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>VERIFICATION LOG</div>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#4ADE80" }}>SHA-256 VERIFIED</div>
                      </div>
                    </div>

                    <div style={{ background: "rgba(0,0,0,0.2)", borderRadius: "24px", padding: "32px", border: "1px solid rgba(255,255,255,0.05)" }}>
                       <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                          <Lock size={18} color="#FF6A00" />
                          <span style={{ fontSize: "12px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.05em" }}>TRUST & SAFETY VALIDATION</span>
                       </div>
                       <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                          {[
                            "Equipment Calibration Confirmed",
                            "Witness Identity Validated",
                            "Biometric Signature Hash Matched",
                            "Spatial Geometry Rules Compliant"
                          ].map((check, idx) => (
                            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.6)" }}>
                               <CheckCircle2 size={14} color="#FF6A00" /> {check}
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>

                  {/* RIGHT: SUBMISSION PREVIEW */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div style={{ background: "#FF6A00", borderRadius: "32px", padding: "32px", color: "white" }}>
                       <div style={{ fontSize: "11px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "16px", opacity: 0.8 }}>ELITE MEMBERSHIP STATUS</div>
                       <h4 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase", lineHeight: "1.1", marginBottom: "12px" }}>READY FOR <br /> CERTIFICATION</h4>
                       <p style={{ fontSize: "13px", fontWeight: "600", opacity: 0.9, lineHeight: "1.5" }}>
                         Your performance meets the criteria for Global Ledger indexing. Upon submission, our adjudication team will finalize the entry.
                       </p>
                    </div>

                    <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "32px", padding: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                       <div>
                         <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "20px" }}>POST-SUBMISSION PREVIEW</div>
                         <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "20px", overflow: "hidden", marginBottom: "20px" }}>
                            <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(10px) brightness(0.5)" }} />
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px" }}>
                               <div style={{ fontSize: "18px", fontWeight: "950", textTransform: "uppercase", letterSpacing: "0.1em" }}>BROKEN:<br />YOUR NAME IN STONE</div>
                            </div>
                         </div>
                       </div>

                      </div>
                    </div>
                  </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px" }}>
                  <button onClick={prevStep} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: "900", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                    <ArrowLeft size={16} /> PREVIOUS STEP
                  </button>
                  <button onClick={nextStep} style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "16px 40px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 20px 40px rgba(255, 106, 0, 0.3)" }}>
                    SUBMIT TO GLOBAL LEDGER
                  </button>
                </div>
              </motion.div>
                )}
              </>
            )}
          </AnimatePresence>
        </div>

        <style>{`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
          input::placeholder, textarea::placeholder {
            color: rgba(255,255,255,0.2) !important;
          }
          select {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23FF6A00' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 24px center;
            background-size: 16px;
          }
        `}</style>
      </div>
    </PageTransition>
  );
};

export default Verify;
