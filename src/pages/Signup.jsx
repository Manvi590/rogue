import { Link } from "react-router-dom";
import { ArrowRight, Zap, Globe, Calendar, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";

const Signup = () => {
  return (
    <div style={{ background: "#0A0A0A", height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column", paddingTop: "140px" }}>
      <Navbar />
      <div style={{ 
        background: "#0A0A0A", 
        color: "white", 
        fontFamily: "'Inter', sans-serif", 
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 5%",
        position: "relative",
        overflow: "hidden"
      }}>
      {/* BACKGROUND IMAGE */}
      <div style={{
        position: "absolute",
        inset: 0,
        backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.15,
        filter: "blur(4px)"
      }} />

      <div style={{ position: "relative", zIndex: 2, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", maxWidth: "1200px", width: "100%", alignItems: "center" }}>
        
        {/* LEFT CONTENT */}
        <div>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "8px", 
            background: "rgba(255, 106, 0, 0.15)", 
            padding: "6px 16px", 
            borderRadius: "100px", 
            color: "#FF6A00", 
            fontSize: "11px", 
            fontWeight: "900", 
            textTransform: "uppercase", 
            letterSpacing: "0.1em",
            marginBottom: "20px",
            border: "1px solid rgba(255, 106, 0, 0.2)"
          }}>
            <Zap size={14} fill="#FF6A00" /> ELITE REGISTRATION
          </div>

          <h1 style={{ 
            fontSize: "clamp(40px, 6vw, 80px)", 
            fontWeight: "950", 
            textTransform: "uppercase", 
            lineHeight: "0.85", 
            letterSpacing: "-0.04em", 
            marginBottom: "20px" 
          }}>
            JOIN THE <br />
            <span style={{ color: "white" }}>ELITE</span>
          </h1>

          <p style={{ 
            color: "rgba(255, 255, 255, 0.6)", 
            fontSize: "16px", 
            lineHeight: "1.6", 
            maxWidth: "450px", 
            marginBottom: "40px" 
          }}>
            Become a verified member of the world's most prestigious athletic record-keeping platform.
          </p>

          <div style={{ display: "flex", gap: "40px" }}>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "950", color: "white" }}>12.4K+</div>
              <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>VERIFIED ATHLETES</div>
            </div>
            <div>
              <div style={{ fontSize: "28px", fontWeight: "950", color: "white" }}>850+</div>
              <div style={{ fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginTop: "4px" }}>WORLD RECORDS</div>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT - FORM CARD */}
        <div style={{ 
          background: "rgba(22, 22, 22, 0.8)", 
          backdropFilter: "blur(20px)", 
          padding: "24px 40px", 
          borderRadius: "40px", 
          border: "1px solid rgba(255, 255, 255, 0.05)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          margin: "20px 0"
        }}>
          <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px", textTransform: "uppercase" }}>FULL NAME</label>
                <input type="text" placeholder="John Doe" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "10px 16px", color: "white", outline: "none", fontSize: "12px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px", textTransform: "uppercase" }}>USERNAME</label>
                <input type="text" placeholder="elite_athlete_01" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "10px 16px", color: "white", outline: "none", fontSize: "12px" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px", textTransform: "uppercase" }}>EMAIL ADDRESS</label>
              <input type="email" placeholder="champion@rogue.com" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "10px 16px", color: "white", outline: "none", fontSize: "12px" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px", textTransform: "uppercase" }}>PASSWORD</label>
              <input type="password" placeholder="********" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "10px 16px", color: "white", outline: "none", fontSize: "12px" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px", textTransform: "uppercase" }}>DATE OF BIRTH</label>
                <input type="text" placeholder="dd-mm-yyyy" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "10px 16px", color: "white", outline: "none", fontSize: "12px" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px", textTransform: "uppercase" }}>COUNTRY</label>
                <select style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "10px 16px", color: "white", outline: "none", appearance: "none", fontSize: "12px" }}>
                  <option>Select Country</option>
                  {[
                    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
                    "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
                    "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
                    "Denmark", "Djibouti", "Dominica", "Dominican Republic",
                    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
                    "Fiji", "Finland", "France",
                    "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
                    "Haiti", "Honduras", "Hungary",
                    "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
                    "Jamaica", "Japan", "Jordan",
                    "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
                    "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
                    "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
                    "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
                    "Oman",
                    "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
                    "Qatar",
                    "Romania", "Russia", "Rwanda",
                    "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
                    "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
                    "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
                    "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
                    "Yemen",
                    "Zambia", "Zimbabwe"
                  ].map(country => (
                    <option key={country} value={country} style={{ background: "#111", color: "white" }}>{country}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255, 255, 255, 0.4)", marginBottom: "4px", textTransform: "uppercase" }}>CITY / STATE</label>
              <input type="text" placeholder="Los Angeles, CA" style={{ width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "10px", padding: "10px 16px", color: "white", outline: "none", fontSize: "12px" }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "2px" }}>
              <input type="checkbox" id="terms" style={{ accentColor: "#FF6A00" }} />
              <label htmlFor="terms" style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.6)" }}>
                I agree to the <Link to="/terms" style={{ color: "#FF6A00", textDecoration: "none" }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: "#FF6A00", textDecoration: "none" }}>Privacy Policy</Link>
              </label>
            </div>

            <button style={{ 
              background: "#FF6A00", 
              color: "white", 
              border: "none", 
              borderRadius: "100px", 
              padding: "14px", 
              fontSize: "13px", 
              fontWeight: "900", 
              textTransform: "uppercase", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: "10px", 
              marginTop: "4px",
              boxShadow: "0 10px 30px rgba(255, 106, 0, 0.3)"
            }}>
              CREATE ACCOUNT <ArrowRight size={16} />
            </button>

            <div style={{ textAlign: "center", marginTop: "8px", fontSize: "11px", color: "rgba(255, 255, 255, 0.4)" }}>
              Already have an account? <Link to="/login" style={{ color: "#FF6A00", textDecoration: "none", fontWeight: "800" }}>LOGIN</Link>
            </div>
          </form>
        </div>

      </div>
    </div>
    </div>
  );
};

export default Signup;
