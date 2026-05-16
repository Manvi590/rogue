import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";

const Shop = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("ALL ITEMS");

  const categories = ["ALL ITEMS", "CERTIFICATES", "HARDWARE", "APPAREL", "LIMITED DROP"];

  const products = [
    {
      id: 1,
      title: "OFFICIAL RECORD CERTIFICATE",
      price: "$45.00",
      desc: "Personalized heavy stock parchment with embossed authentication seal and archival ink.",
      img: "https://images.unsplash.com/photo-1589330694653-976414ef5ca8?auto=format&fit=crop&w=600&q=80",
      badge: "AUTHENTICATED",
      category: "CERTIFICATES"
    },
    {
      id: 2,
      title: "BRUSHED STEEL PLAQUE",
      price: "$120.00",
      desc: "Laser etched industrial grade steel with custom event details and mounting hardware.",
      img: "https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?auto=format&fit=crop&w=600&q=80",
      badge: "ELITE LEVEL",
      category: "HARDWARE"
    },
    {
      id: 3,
      title: "ARENA OVERSIZED HOODIE",
      price: "$85.00",
      desc: "Heavyweight 500gsm french terry cotton with high-density silicone logo print.",
      img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=80",
      badge: "APPAREL",
      category: "APPAREL"
    },
    {
      id: 4,
      title: "TITAN RECORD MEDAL",
      price: "$150.00",
      desc: "Solid brass core with silk gunplating. Custom engraved finish with woven rib.",
      img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
      badge: "LEGENDARY",
      category: "LIMITED DROP"
    },
  ];

  const buttonHover = {
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,106,0,0.3)";
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "none";
    },
    onMouseDown: (e) => {
      e.currentTarget.style.transform = "scale(0.95)";
    },
    onMouseUp: (e) => {
      e.currentTarget.style.transform = "scale(1.05)";
    }
  };

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", fontFamily: "'Inter', sans-serif", minHeight: "100vh", paddingTop: "80px", display: "flex", flexDirection: "column" }}>

        {/* NAVBAR */}
        <Navbar />

        {/* HERO SECTION */}
        <header style={{ position: "relative", height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", margin: "20px 2.5%", borderRadius: "40px", marginTop: "20px" }}>
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80"
            alt="Rogue Gear Shop"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, rgba(10,10,10,0.8))" }} />

          <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
            <div style={{ background: "#FF6A00", color: "white", display: "inline-block", padding: "4px 12px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase", marginBottom: "16px" }}>
              OFFICIAL GEAR
            </div>
            <h1 style={{ fontSize: "clamp(48px, 10vw, 100px)", fontWeight: "950", textTransform: "uppercase", letterSpacing: "-0.04em", marginBottom: "16px", lineHeight: "1.0" }}>
              <ScrollReveal>ROGUE GEAR &</ScrollReveal> <br />
              <span style={{ color: "#FF6A00" }}><ScrollReveal>CERTIFICATES</ScrollReveal></span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "16px", maxWidth: "600px", margin: "0 auto" }}>
              Commemorate your achievements with official verification hardware and elite-tier performance apparel.
            </p>
          </div>
        </header>

        {/* CATEGORY TABS */}
        <div style={{ padding: "0 5%", marginBottom: "40px", marginTop: "40px" }}>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-start", flexWrap: "wrap", maxWidth: "1400px", margin: "0 auto" }}>
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
                  transition: "all 0.2s",
                  textTransform: "uppercase"
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <section style={{ padding: "0 5% 100px", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {products
              .filter(p => activeTab === "ALL ITEMS" || p.category === activeTab)
              .map((product) => (
                <div key={product.id} style={{ background: "#161616", borderRadius: "32px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column" }}>
                  <div style={{ position: "relative", height: "220px" }}>
                    <img src={product.img} alt={product.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <div style={{ position: "absolute", top: "16px", right: "16px", background: "#FF6A00", color: "white", padding: "4px 12px", borderRadius: "8px", fontSize: "9px", fontWeight: "900" }}>
                      {product.badge}
                    </div>
                  </div>
                  <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                      <h3 style={{ fontSize: "16px", fontWeight: "900", textTransform: "uppercase", width: "70%", lineHeight: "1.2" }}>{product.title}</h3>
                      <div style={{ fontSize: "16px", fontWeight: "900", color: "#FF6A00" }}>{product.price}</div>
                    </div>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: "1.6", marginBottom: "24px" }}>{product.desc}</p>
                    <button
                      onClick={() => navigate('/cart')}
                      {...buttonHover}
                      style={{
                        marginTop: "auto",
                        background: "#FF6A00",
                        color: "white",
                        border: "none",
                        borderRadius: "100px",
                        padding: "16px",
                        fontSize: "12px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                      }}
                    >
                      ADD TO CART <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* PREMIUM ELITE CTA */}
        <section style={{ padding: "0 2.5% 120px" }}>
          <div className="orange-cta" style={{ borderRadius: "40px", overflow: "hidden", minHeight: "500px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Dynamic backgrounds */}
            <div className="orange-cta-bg" style={{ opacity: 0.2 }} />
            <div className="orange-cta-grid" />
            <div className="orange-cta-glow" />

            <div className="orange-cta-content" style={{ maxWidth: "800px", width: "100%" }}>
              <span className="orange-cta-badge" style={{ marginBottom: "24px" }}>LEVEL UP YOUR STATUS</span>
              <h2 className="orange-cta-title" style={{ fontSize: "clamp(48px, 6vw, 84px)", lineHeight: "0.95", marginBottom: "24px", textAlign: "center" }}>
                <ScrollReveal>UNLOCKED </ScrollReveal><span className="orange-cta-highlight"><ScrollReveal>ACCESS</ScrollReveal></span>
              </h2>
              <p className="orange-cta-subtitle" style={{ fontSize: "18px", color: "rgba(255,255,255,0.8)", marginBottom: "48px", textAlign: "center", maxWidth: "600px" }}>
                <ScrollReveal>Elite members receive 20% off all physical certificates and priority access to limited edition athlete apparel drops.</ScrollReveal>
              </p>

              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", justifyContent: "center" }}>
                <button
                  onClick={() => navigate('/elite')}
                  {...buttonHover}
                  style={{
                    background: "#111",
                    color: "white",
                    border: "none",
                    borderRadius: "100px",
                    padding: "20px 48px",
                    fontSize: "14px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
                  }}
                >
                  JOIN THE ELITE <Star size={18} fill="#FF6A00" color="#FF6A00" />
                </button>
                <button
                  onClick={() => navigate('/process')}
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    borderRadius: "100px",
                    padding: "20px 48px",
                    fontSize: "14px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.25)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.15)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  LEARN MORE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <Footer />

      </div>
    </PageTransition>
  );
};

export default Shop;
