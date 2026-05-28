import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CreditCard, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../utils/api";

const SubmissionCheckout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { submissionData } = location.state || {};
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!submissionData) {
    return (
      <div style={{ padding: "200px 20px", textAlign: "center", color: "white", background: "#0A0A0A", minHeight: "100vh" }}>
        <h2>NO SUBMISSION DATA FOUND</h2>
        <button onClick={() => navigate(-1)} style={{ padding: "10px 20px", background: "#FF6A00", border: "none", color: "white", borderRadius: "100px", marginTop: "20px", cursor: "pointer", fontWeight: "900" }}>GO BACK</button>
      </div>
    );
  }

  const [trackingNumber, setTrackingNumber] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      if (!submissionData.id || submissionData.id === 'TEMP') {
        throw new Error("Invalid submission ID. Please try submitting again.");
      }
      
      const response = await apiCall(`/records/${submissionData.id}/checkout`, 'POST', {}, user?.token);
      
      setTrackingNumber(response.trackingNumber || `RWR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
      setSuccess(true);
    } catch (e) {
      console.error("Checkout failed:", e);
      setError(e.message || "Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageTransition>
        <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "white", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <div style={{ padding: "180px 5% 120px", flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <div style={{ textAlign: "center", maxWidth: "600px" }}>
              <div style={{ width: "120px", height: "120px", background: "rgba(74, 222, 128, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 40px", border: "2px solid #4ADE80" }}>
                <CheckCircle2 size={60} color="#4ADE80" />
              </div>
              <h1 style={{ fontSize: "40px", fontWeight: "950", textTransform: "uppercase", marginBottom: "20px" }}>PAYMENT <span style={{ color: "#FF6A00" }}>SUCCESSFUL</span></h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", marginBottom: "40px", lineHeight: "1.6" }}>
                Thank you! Your order has been processed securely. Our adjudication team will get back to you with the results using the email you provided.
              </p>
              
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "24px", padding: "30px", marginBottom: "40px", textAlign: "left", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3 style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "8px" }}>OFFICIAL TRACKING NUMBER</h3>
                <div style={{ fontSize: "28px", fontWeight: "950", color: "#FF6A00", letterSpacing: "2px" }}>{trackingNumber}</div>
              </div>
              
              <button onClick={() => navigate("/")} style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px 48px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 20px 40px rgba(255,106,0,0.2)" }}>
                RETURN TO HOME BASE
              </button>
            </div>
          </div>
          <Footer />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", minHeight: "100vh", color: "white", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ padding: "180px 5% 120px", flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "1000px", width: "100%" }}>
            <div style={{ marginBottom: "40px" }}>
              <h1 style={{ fontSize: "40px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>SECURE <span style={{ color: "#FF6A00" }}>CHECKOUT</span></h1>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "16px" }}>Complete the mandatory $3.50 processing fee to officially submit your application.</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "40px" }}>
              {/* Desktop layout: we use flex or grid to split. Let's use flex wrap for responsiveness */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "40px" }}>
                
                {/* Payment Info */}
                <div style={{ flex: "1 1 500px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: "900", textTransform: "uppercase", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <CreditCard color="#FF6A00" /> PAYMENT METHOD
                  </h3>
                  
                  {error && (
                    <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid #EF4444", color: "#EF4444", padding: "12px", borderRadius: "12px", fontSize: "12px", fontWeight: "700", marginBottom: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                      <AlertCircle size={16} /> {error}
                    </div>
                  )}
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
                    <input type="text" placeholder="CARDHOLDER NAME" defaultValue={submissionData.athleteName || submissionData.athleteId || (user ? user.name : "")} style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", color: "white", outline: "none" }} />
                    <input type="text" placeholder="CARD NUMBER (0000 0000 0000 0000)" style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", color: "white", outline: "none" }} />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <input type="text" placeholder="MM/YY" style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", color: "white", outline: "none" }} />
                      <input type="text" placeholder="CVC" style={{ width: "100%", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "16px", color: "white", outline: "none" }} />
                    </div>
                  </div>

                  <button 
                    onClick={handlePayment} 
                    disabled={loading}
                    style={{ width: "100%", background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(255,106,0,0.2)", opacity: loading ? 0.7 : 1 }}
                  >
                    {loading ? <><Loader2 size={18} className="animate-spin" /> PROCESSING...</> : "PAY $3.50 & SUBMIT"}
                  </button>
                </div>

                {/* Order Summary */}
                <div style={{ flex: "1 1 300px" }}>
                  <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "32px", marginBottom: "20px" }}>
                    <h3 style={{ fontSize: "14px", fontWeight: "900", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>ORDER SUMMARY</h3>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px" }}>
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>Submission Type:</span>
                      <span style={{ fontWeight: "700" }}>{submissionData.recordType === 'challenge' ? 'Challenge Record' : 'Submit Record'}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", fontSize: "14px" }}>
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>Applicant:</span>
                      <span style={{ fontWeight: "700", textAlign: "right" }}>{submissionData.athleteName || submissionData.athleteId || (user ? user.name : "Applicant")}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px", fontSize: "14px" }}>
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>Record Title:</span>
                      <span style={{ fontWeight: "700", textAlign: "right", maxWidth: "60%" }}>{submissionData.title}</span>
                    </div>
                    
                    <div style={{ height: "1px", background: "rgba(255,255,255,0.1)", marginBottom: "20px" }}></div>
                    
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "18px", fontWeight: "900" }}>
                      <span>TOTAL FEE</span>
                      <span style={{ color: "#FF6A00" }}>$3.50</span>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: "1.5", textAlign: "center" }}>
                    By completing this payment, you agree that this submission fee is non-refundable regardless of the adjudication outcome.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default SubmissionCheckout;
