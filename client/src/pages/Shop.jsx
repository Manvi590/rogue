import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Star, UploadCloud, Trash2 } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import { apiCall, formatProductImage } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Shop = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("ALL ITEMS");
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [toast, setToast] = useState("");

  // Admin Certificate & Award Hub states
  const [adminSubTab, setAdminSubTab] = useState("generator");
  
  // Certificate states
  const [certName, setCertName] = useState("JOHNATHAN TITAN");
  const [certRecord, setCertRecord] = useState("HEAVYWEIGHT BENCH PRESS WORLD RECORD");
  const [certValue, setCertValue] = useState("502.5 KG");
  const [certAdjudicator, setCertAdjudicator] = useState("CHIEF MARSHAL O'NEILL");
  const [certDate, setCertDate] = useState(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase());
  const [certTheme, setCertTheme] = useState("onyx"); // "onyx" | "parchment" | "gold" | "glacial"

  // Medal & Award Creator states
  const [awardName, setAwardName] = useState("");
  const [awardPrice, setAwardPrice] = useState("");
  const [awardDesc, setAwardDesc] = useState("");
  const [awardStock, setAwardStock] = useState("10");
  const [awardCategory, setAwardCategory] = useState("CERTIFICATES");
  const [awardImageFile, setAwardImageFile] = useState(null);
  const [awardImagePreview, setAwardImagePreview] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const awardFileInputRef = React.useRef(null);

  // Framed Award Orders states
  const [awardOrders, setAwardOrders] = useState([
    { id: "ord-1", name: "Johnathan Titan", product: "Embossed Obsidian Framed Certificate", date: "2026-05-12", frameType: "Obsidian Frame", customDetails: "Recipient: Johnathan Titan - 502.5kg Bench Press", status: "processing" },
    { id: "ord-2", name: "Michael Jordan", product: "Titan Gold Medal & Premium Ribbon", date: "2026-05-18", frameType: "Gold Leaf Border", customDetails: "Recipient: Michael Jordan - Retro Basketball Max Score", status: "shipped" },
    { id: "ord-3", name: "Serena Williams", product: "Archival Brushed Steel Plaque", date: "2026-05-24", frameType: "Brushed Steel Frame", customDetails: "Recipient: Serena Williams - Glacial Endurance Ice Swim", status: "pending" }
  ]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 4000);
  };

  const handleCreateAwardProduct = async (e) => {
    e.preventDefault();
    if (!awardName || !awardPrice) {
      showToast("Please provide award name and price.");
      return;
    }

    const payload = {
      name: awardName,
      description: awardDesc,
      price: parseFloat(awardPrice),
      imageUrl: "",
      category: awardCategory,
      stockCount: parseInt(awardStock) || 10,
      sizes: [],
      imageUrls: []
    };

    try {
      if (user && user.token) {
        let newProd = await apiCall("/admin/products", "POST", payload, user.token);
        
        if (awardImageFile) {
          try {
            const formData = new FormData();
            formData.append("productImage", awardImageFile);
            
            const res = await fetch(import.meta.env.VITE_API_URL + `/admin/products/${newProd.id}/image`, {
              method: "POST",
              headers: { Authorization: `Bearer ${user.token}` },
              body: formData
            });
            
            if (!res.ok) throw new Error("Upload response not OK");
            
            const uploadData = await res.json();
            // Update the local product's image url
            newProd = uploadData.product || { ...newProd, image_url: uploadData.imageUrl };
            showToast("Product image uploaded successfully.");
          } catch (uploadErr) {
            console.error("Image upload failed:", uploadErr);
            showToast("Image upload failed. Please try again.");
          }
        }
        
        setDbProducts(prev => [newProd, ...prev]);
        showToast("🎖️ Custom Award Product Created Successfully in Database!");
      } else {
        throw new Error("No admin token");
      }
    } catch (err) {
      console.warn("Backend API unavailable. Creating award locally in mock catalog.", err);
      const mockProd = {
        id: Date.now(),
        name: payload.name,
        description: payload.description,
        price: payload.price,
        image_url: awardImagePreview || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80",
        category: payload.category,
        stock_count: payload.stockCount
      };
      setDbProducts(prev => [mockProd, ...prev]);
      showToast("🎖️ Custom Award Product Created Locally!");
    }

    // Reset Form
    setAwardName("");
    setAwardPrice("");
    setAwardDesc("");
    setAwardStock("10");
    setAwardImageFile(null);
    setAwardImagePreview("");
  };

  const handleToggleShipping = (orderId) => {
    setAwardOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const nextStatus = o.status === "shipped" ? "processing" : "shipped";
        showToast(`📦 Order ${orderId} marked as ${nextStatus.toUpperCase()}!`);
        return { ...o, status: nextStatus };
      }
      return o;
    }));
  };

  const handlePrintSheet = (order) => {
    showToast(`🖨️ Custom Customization Sheet Dispatched for: ${order.name}`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiCall("/shop", "GET");
        setDbProducts(data || []);
      } catch (err) {
        console.error("Failed to load products from database:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) {
      setActiveTab(cat.toUpperCase());
    } else {
      setActiveTab("ALL ITEMS");
    }
  }, [searchParams]);

  const categories = ["ALL ITEMS", "TICKETS", "CERTIFICATES", "HARDWARE", "APPAREL", "LIMITED DROP"];

  const hardcodedProducts = [

    {
      id: 5,
      title: "LIVE EVENT SPECTATOR PASS",
      price: "$15.00",
      desc: "Digital entry pass to witness live records. Includes live chat, backstage footage access, and multi-cam viewing.",
      img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=600&q=80",
      badge: "LIVE TICKETS",
      category: "TICKETS"
    },
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

  const products = dbProducts.length > 0
    ? dbProducts.map(p => ({
        id: p.id,
        title: p.name,
        price: `$${parseFloat(p.price).toFixed(2)}`,
        desc: p.description,
        img: formatProductImage(p.image_url),
        badge: p.category?.toUpperCase() || "GEAR",
        category: p.category?.toUpperCase() || "APPAREL"
      }))
    : hardcodedProducts;

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
                onClick={() => {
                  setActiveTab(cat);
                  if (cat === "ALL ITEMS") {
                    searchParams.delete("category");
                  } else {
                    searchParams.set("category", cat.toLowerCase());
                  }
                  setSearchParams(searchParams);
                }}
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

        {/* TOAST NOTIFICATION CONTAINER */}
        {toast && (
          <div style={{
            position: "fixed",
            top: "120px",
            right: "5%",
            zIndex: 9999,
            background: "rgba(255, 106, 0, 0.15)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 106, 0, 0.4)",
            padding: "16px 28px",
            borderRadius: "16px",
            color: "white",
            fontSize: "14px",
            fontWeight: "800",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}>
            <div style={{ width: "8px", height: "8px", background: "#FF6A00", borderRadius: "50%" }}></div>
            {toast}
          </div>
        )}

        {/* 🎖️ ADMIN CERTIFICATE & AWARD HUB */}
        {activeTab === "CERTIFICATES" && user && user.isAdmin && (
          <div style={{
            background: "rgba(20, 20, 20, 0.4)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 106, 0, 0.15)",
            borderRadius: "32px",
            padding: "40px",
            maxWidth: "1400px",
            width: "90%",
            margin: "0 auto 40px",
            boxShadow: "0 30px 60px rgba(0,0,0,0.4)"
          }}>
            
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "24px", marginBottom: "32px" }}>
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: "950", color: "white", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "6px" }}>
                  🎖️ CERTIFICATE & AWARD CONTROL SUITE
                </h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
                  Customize live certificates, upload border templates, add physical medals to the Shop catalog, and review framed award customizations.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                {[
                  { id: "generator", label: "🎨 Visual Generator" },
                  { id: "templates", label: "📁 Theme templates" },
                  { id: "medal-creator", label: "🏅 Award Creator" },
                  { id: "orders", label: "📦 Framed Orders" }
                ].map(sub => (
                  <button
                    key={sub.id}
                    onClick={() => setAdminSubTab(sub.id)}
                    style={{
                      background: adminSubTab === sub.id ? "#FF6A00" : "rgba(255,255,255,0.05)",
                      color: "white",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "100px",
                      fontSize: "11px",
                      fontWeight: "900",
                      cursor: "pointer",
                      textTransform: "uppercase",
                      transition: "all 0.2s"
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Tab Body */}
            <div>
              {/* TAB 1: VISUAL GENERATOR */}
              {adminSubTab === "generator" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "40px" }}>
                  {/* Left Column: Form */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>RECIPIENT FULL NAME</label>
                      <input 
                        type="text" 
                        value={certName}
                        onChange={e => setCertName(e.target.value.toUpperCase())}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>RECORD SCHEME / DESCRIPTION</label>
                      <input 
                        type="text" 
                        value={certRecord}
                        onChange={e => setCertRecord(e.target.value.toUpperCase())}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>ACHIEVEMENT VALUE</label>
                        <input 
                          type="text" 
                          value={certValue}
                          onChange={e => setCertValue(e.target.value.toUpperCase())}
                          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>ACHIEVED DATE</label>
                        <input 
                          type="text" 
                          value={certDate}
                          onChange={e => setCertDate(e.target.value.toUpperCase())}
                          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>VERIFYING ADJUDICATOR</label>
                        <input 
                          type="text" 
                          value={certAdjudicator}
                          onChange={e => setCertAdjudicator(e.target.value.toUpperCase())}
                          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>SELECT TEMPLATE STYLE</label>
                        <select 
                          value={certTheme}
                          onChange={e => setCertTheme(e.target.value)}
                          style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px", color: "white", fontSize: "13px", outline: "none", cursor: "pointer" }}
                        >
                          <option value="onyx">ROGUE ONYX PREMIUM (CARBON)</option>
                          <option value="parchment">CLASSIC IVORY PARCHMENT (VINTAGE)</option>
                          <option value="gold">TITAN GOLD ARENA (LUXURY)</option>
                          <option value="glacial">GLACIAL SUB-ZERO ENDURANCE (ICE)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => showToast("🖨️ Archival High-Definition Certificate Dispatched to Printer!")}
                      style={{
                        background: "#FF6A00",
                        color: "white",
                        border: "none",
                        borderRadius: "100px",
                        padding: "16px 36px",
                        fontSize: "12px",
                        fontWeight: "900",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        marginTop: "12px",
                        boxShadow: "0 10px 20px rgba(255,106,0,0.2)"
                      }}
                    >
                      🖨️ PRINT & SHIP CERTIFICATE
                    </button>
                  </div>

                  {/* Right Column: High-Fidelity Interactive Preview Card */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{
                      width: "100%",
                      maxWidth: "560px",
                      aspectRatio: "1.414", 
                      padding: "24px",
                      boxSizing: "border-box",
                      borderRadius: "16px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.6)",
                      border: 
                        certTheme === "onyx" ? "3px double #FF6A00" :
                        certTheme === "parchment" ? "3px double #8a6d3b" :
                        certTheme === "gold" ? "3px double #d4af37" :
                        "3px double #38bdf8",
                      background:
                        certTheme === "onyx" ? "radial-gradient(circle, #1a1a1a 0%, #0a0a0a 100%)" :
                        certTheme === "parchment" ? "#f4edd8" :
                        certTheme === "gold" ? "radial-gradient(circle, #2d2410 0%, #0c0903 100%)" :
                        "radial-gradient(circle, #0e1e24 0%, #050a0c 100%)",
                      color: certTheme === "parchment" ? "#222" : "white"
                    }}>
                      
                      <div style={{
                        position: "absolute",
                        inset: "8px",
                        border: 
                          certTheme === "onyx" ? "1px solid rgba(255,106,0,0.2)" :
                          certTheme === "parchment" ? "1px solid rgba(138,109,59,0.3)" :
                          certTheme === "gold" ? "1px solid rgba(212,175,55,0.3)" :
                          "1px solid rgba(56,189,248,0.2)",
                        pointerEvents: "none"
                      }} />

                      <div style={{ textAlign: "center", marginTop: "12px", zIndex: 2 }}>
                        <div style={{ 
                          fontSize: "8px", 
                          fontWeight: "900", 
                          letterSpacing: "3px", 
                          color: 
                            certTheme === "parchment" ? "#8a6d3b" : 
                            certTheme === "gold" ? "#d4af37" : 
                            certTheme === "glacial" ? "#38bdf8" : 
                            "#FF6A00",
                          marginBottom: "4px"
                        }}>
                          ROGUE WORLD RECORDS ASSOCIATION
                        </div>
                        <h4 style={{ 
                          fontSize: "20px", 
                          fontWeight: "950", 
                          letterSpacing: "-0.5px", 
                          fontFamily: "'Playfair Display', 'Georgia', serif",
                          margin: 0
                        }}>
                          CERTIFICATE OF RECORD ACHIEVEMENT
                        </h4>
                        <div style={{
                          fontSize: "7px",
                          fontWeight: "800",
                          letterSpacing: "1.5px",
                          marginTop: "4px",
                          opacity: 0.8,
                          color:
                            certTheme === "parchment" ? "#555" :
                            certTheme === "gold" ? "#d4af37" :
                            certTheme === "glacial" ? "#38bdf8" :
                            "#FF6A00",
                          textTransform: "uppercase"
                        }}>
                          MEMBER NUMBER: {user?.memberNumber || user?.member_number || "AWR-000245"}
                        </div>
                      </div>

                      <div style={{ textAlign: "center", zIndex: 2, padding: "0 20px" }}>
                        <div style={{ fontSize: "7px", letterSpacing: "1px", fontStyle: "italic", opacity: 0.6, marginBottom: "4px" }}>
                          THIS IS TO OFFICIALLY CERTIFY THAT
                        </div>
                        <div style={{ 
                          fontSize: "22px", 
                          fontWeight: "950", 
                          letterSpacing: "0.5px", 
                          fontFamily: "'Playfair Display', 'Georgia', serif",
                          color: 
                            certTheme === "parchment" ? "#000" :
                            certTheme === "gold" ? "#facc15" :
                            "white",
                          borderBottom: certTheme === "parchment" ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
                          display: "inline-block",
                          paddingBottom: "2px",
                          marginBottom: "8px",
                          width: "80%"
                        }}>
                          {certName || "JOHNATHAN TITAN"}
                        </div>
                        
                        <div style={{ fontSize: "7px", letterSpacing: "1px", fontStyle: "italic", opacity: 0.6, marginBottom: "6px" }}>
                          SUCCESSFULLY BROKE THE STANDING WORLD RECORD FOR
                        </div>
                        
                        <div style={{ 
                          fontSize: "12px", 
                          fontWeight: "900", 
                          letterSpacing: "0.5px", 
                          lineHeight: "1.2",
                          width: "90%",
                          margin: "0 auto 6px",
                          textTransform: "uppercase"
                        }}>
                          {certRecord || "BENCH PRESS RECORD ATTEMPT"}
                        </div>

                        <div style={{ fontSize: "7px", letterSpacing: "1px", fontStyle: "italic", opacity: 0.6, marginBottom: "2px" }}>
                          WITH AN OFFICIAL REGISTERED VALUE OF
                        </div>
                        <div style={{ 
                          fontSize: "24px", 
                          fontWeight: "950", 
                          color: 
                            certTheme === "parchment" ? "#8a6d3b" :
                            certTheme === "gold" ? "#d4af37" :
                            certTheme === "glacial" ? "#38bdf8" :
                            "#FF6A00"
                        }}>
                          {certValue || "500.00 KG"}
                        </div>
                      </div>

                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", zIndex: 2, padding: "0 16px 8px" }}>
                        <div style={{ width: "120px", textAlign: "center" }}>
                          <div style={{ 
                            fontSize: "11px", 
                            fontFamily: "'Brush Script MT', 'cursive', 'Georgia'", 
                            color: certTheme === "parchment" ? "#555" : "rgba(255,255,255,0.8)",
                            lineHeight: "1",
                            marginBottom: "2px"
                          }}>
                            {certAdjudicator || "Chief Marshall"}
                          </div>
                          <div style={{ borderTop: certTheme === "parchment" ? "1px solid #222" : "1px solid rgba(255,255,255,0.4)", width: "100%", height: "1px" }} />
                          <div style={{ fontSize: "6px", fontWeight: "900", opacity: 0.5, marginTop: "2px", letterSpacing: "0.5px" }}>
                            VERIFYING ADJUDICATOR
                          </div>
                        </div>

                        <div style={{
                          position: "relative",
                          width: "48px",
                          height: "48px",
                          background: "radial-gradient(circle, #ffe259 0%, #ffa751 100%)",
                          borderRadius: "50%",
                          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                          border: "1px dashed #d4af37",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transform: "scale(1.1)"
                        }}>
                          <div style={{ fontSize: "16px" }}>⭐</div>
                          <div style={{ position: "absolute", width: "12px", height: "30px", background: "rgba(212,175,55,0.8)", bottom: "-20px", left: "6px", transform: "rotate(20deg)", zIndex: -1, borderBottom: "3px solid transparent" }} />
                          <div style={{ position: "absolute", width: "12px", height: "30px", background: "rgba(212,175,55,0.8)", bottom: "-20px", right: "6px", transform: "rotate(-20deg)", zIndex: -1, borderBottom: "3px solid transparent" }} />
                        </div>

                        <div style={{ width: "120px", textAlign: "center" }}>
                          <div style={{ fontSize: "8px", fontWeight: "900", marginBottom: "3px" }}>
                            {certDate}
                          </div>
                          <div style={{ borderTop: certTheme === "parchment" ? "1px solid #222" : "1px solid rgba(255,255,255,0.4)", width: "100%", height: "1px" }} />
                          <div style={{ fontSize: "6px", fontWeight: "900", opacity: 0.5, marginTop: "2px", letterSpacing: "0.5px" }}>
                            DATE REGISTERED
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: THEME TEMPLATES MANAGER */}
              {adminSubTab === "templates" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
                  {[
                    { id: "onyx", title: "ROGUE ONYX PREMIUM", desc: "Dark Slate with carbon fiber textures & vibrant orange border line accents.", tags: "MOST POPULAR" },
                    { id: "parchment", title: "CLASSIC IVORY PARCHMENT", desc: "Elegant linen ivory finish with sepia classical framing & cursive styling.", tags: "TRADITIONAL" },
                    { id: "gold", title: "TITAN GOLD ARENA", desc: "Solid gold foil speckled frames with deep obsidian text borders.", tags: "CHAMPION" },
                    { id: "glacial", title: "GLACIAL SUB-ZERO", desc: "Alpine sub-zero endurance frost-blue gradient frame styling.", tags: "ENDURANCE" }
                  ].map(style => (
                    <div 
                      key={style.id} 
                      onClick={() => {
                        setCertTheme(style.id);
                        setAdminSubTab("generator");
                        showToast(`Theme changed to: ${style.title}`);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                        borderRadius: "20px",
                        padding: "24px",
                        cursor: "pointer",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = "#FF6A00";
                        e.currentTarget.style.transform = "translateY(-4px)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                        e.currentTarget.style.transform = "none";
                      }}
                    >
                      <div style={{ background: "rgba(255,255,255,0.05)", height: "80px", borderRadius: "12px", marginBottom: "16px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "20px" }}>
                          {style.id === "onyx" ? "🖤" : style.id === "parchment" ? "📜" : style.id === "gold" ? "🏆" : "❄️"}
                        </span>
                      </div>
                      <span style={{ fontSize: "8px", fontWeight: "900", background: "rgba(255,106,0,0.15)", color: "#FF6A00", padding: "2px 8px", borderRadius: "4px" }}>
                        {style.tags}
                      </span>
                      <h4 style={{ fontSize: "14px", fontWeight: "900", color: "white", marginTop: "12px", marginBottom: "6px" }}>{style.title}</h4>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: 0, lineHeight: "1.4" }}>{style.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: AWARD CREATOR */}
              {adminSubTab === "medal-creator" && (
                <form onSubmit={handleCreateAwardProduct} style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "20px" }}>
                  <h4 style={{ fontSize: "15px", fontWeight: "950", color: "white", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
                    🏅 INJECT NEW MEDAL OR PLAQUE PRODUCT INTO SHOP CATALOG
                  </h4>

                  <div style={{ display: "grid", gridTemplateColumns: "1.5fr 0.5fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>AWARD NAME</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. SOLID PLATINUM ADJUDICATION TROPHY"
                        value={awardName}
                        onChange={e => setAwardName(e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>PRICE ($ USD)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        required
                        placeholder="150.00"
                        value={awardPrice}
                        onChange={e => setAwardPrice(e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>PRODUCT DESCRIPTION</label>
                    <textarea 
                      placeholder="Laser-etched high precision core with solid engraving specs..."
                      value={awardDesc}
                      onChange={e => setAwardDesc(e.target.value)}
                      style={{ width: "100%", height: "80px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none", resize: "none" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>CATALOG STOCK COUNT</label>
                      <input 
                        type="number" 
                        value={awardStock}
                        onChange={e => setAwardStock(e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "13px", outline: "none" }}
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>PRODUCT CATEGORY</label>
                      <select 
                        value={awardCategory}
                        onChange={e => setAwardCategory(e.target.value)}
                        style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "12px", color: "white", fontSize: "13px", outline: "none", cursor: "pointer" }}
                      >
                        <option value="CERTIFICATES">CERTIFICATES</option>
                        <option value="HARDWARE">HARDWARE</option>
                        <option value="LIMITED DROP">LIMITED DROP</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>UPLOAD PRODUCT IMAGE</label>
                    <input 
                      type="file" 
                      ref={awardFileInputRef}
                      accept=".jpg,.jpeg,.png,.webp"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          if (file.size > 10 * 1024 * 1024) {
                            showToast("Image size must be less than 10MB.");
                            return;
                          }
                          const ext = file.name.split('.').pop().toLowerCase();
                          if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
                            showToast("Invalid image format. Allowed: JPG, JPEG, PNG, WEBP.");
                            return;
                          }
                          setAwardImageFile(file);
                          setAwardImagePreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    
                    <div
                      onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragActive(false);
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          const file = e.dataTransfer.files[0];
                          if (file.size > 10 * 1024 * 1024) {
                            showToast("Image size must be less than 10MB.");
                            return;
                          }
                          const ext = file.name.split('.').pop().toLowerCase();
                          if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
                            showToast("Invalid image format. Allowed: JPG, JPEG, PNG, WEBP.");
                            return;
                          }
                          setAwardImageFile(file);
                          setAwardImagePreview(URL.createObjectURL(file));
                        }
                      }}
                      onClick={() => awardFileInputRef.current?.click()}
                      style={{
                        background: dragActive ? "rgba(255, 106, 0, 0.1)" : "rgba(255,255,255,0.02)",
                        border: dragActive ? "2px dashed #FF6A00" : "1px dashed rgba(255,255,255,0.15)",
                        borderRadius: "16px",
                        padding: "30px 20px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        position: "relative",
                        overflow: "hidden"
                      }}
                    >
                      {awardImagePreview ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", position: "relative" }}>
                          <img src={awardImagePreview} alt="Award Preview" style={{ maxWidth: "200px", maxHeight: "150px", borderRadius: "12px", objectFit: "cover", border: "1px solid rgba(255,255,255,0.1)" }} />
                          <div style={{ fontSize: "12px", color: "white", fontWeight: "700" }}>{awardImageFile?.name}</div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAwardImageFile(null);
                              setAwardImagePreview("");
                            }}
                            style={{
                              background: "rgba(239, 68, 68, 0.15)",
                              border: "none",
                              color: "#ef4444",
                              padding: "6px 14px",
                              borderRadius: "100px",
                              fontSize: "11px",
                              fontWeight: "900",
                              textTransform: "uppercase",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              transition: "all 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.3)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"}
                          >
                            <Trash2 size={12} /> Remove Image
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                          <UploadCloud size={36} color="#FF6A00" />
                          <div style={{ fontSize: "13px", fontWeight: "800", color: "white" }}>
                            DRAG & DROP IMAGE HERE OR <span style={{ color: "#FF6A00", textDecoration: "underline" }}>BROWSE</span>
                          </div>
                          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                            Supports JPG, JPEG, PNG, WEBP up to 10MB
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    type="submit"
                    style={{
                      background: "#FF6A00",
                      color: "white",
                      border: "none",
                      borderRadius: "100px",
                      padding: "16px 40px",
                      fontSize: "12px",
                      fontWeight: "900",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      alignSelf: "flex-start",
                      marginTop: "10px",
                      boxShadow: "0 10px 20px rgba(255,106,0,0.2)"
                    }}
                  >
                    🏅 CREATE SHOP AWARD PRODUCT
                  </button>
                </form>
              )}

              {/* TAB 4: FRAMED ORDERS LEDGER */}
              {adminSubTab === "orders" && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                    <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px" }}>
                      IN-COMMEMORATIVE FRAMING DISPATCH LOGS
                    </div>
                    <span style={{ fontSize: "11px", color: "#FF6A00", fontWeight: "800" }}>
                      TOTAL COMPLETED FRAMINGS: {awardOrders.filter(o => o.status === "shipped").length}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {awardOrders.map((ord) => (
                      <div 
                        key={ord.id}
                        style={{
                          background: "rgba(255,255,255,0.01)",
                          border: "1px solid rgba(255,255,255,0.04)",
                          borderRadius: "16px",
                          padding: "20px 28px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ fontSize: "15px", fontWeight: "900", color: "white" }}>{ord.name}</span>
                            <span style={{ fontSize: "9px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)", padding: "2px 8px", borderRadius: "4px", fontWeight: "800" }}>
                              {ord.frameType}
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "#FF6A00", fontWeight: "700", marginTop: "4px" }}>
                            Product: <span style={{ color: "white", fontWeight: "500" }}>{ord.product}</span>
                          </div>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "6px 0 0 0", fontStyle: "italic" }}>
                            {ord.customDetails}
                          </p>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontWeight: "700" }}>Ordered: {ord.date}</span>
                          
                          <span style={{
                            fontSize: "10px",
                            fontWeight: "900",
                            padding: "4px 12px",
                            borderRadius: "100px",
                            background: ord.status === "shipped" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.12)",
                            color: ord.status === "shipped" ? "#22C55E" : "#EF4444",
                            textTransform: "uppercase"
                          }}>
                            {ord.status === "shipped" ? "Framed & Shipped" : "Processing Frame"}
                          </span>

                          <button
                            onClick={() => handlePrintSheet(ord)}
                            style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "white", padding: "8px 16px", borderRadius: "8px", fontSize: "11px", fontWeight: "800", cursor: "pointer" }}
                          >
                            🖨️ PRINT SHEET
                          </button>

                          <button
                            onClick={() => handleToggleShipping(ord.id)}
                            style={{
                              background: ord.status === "shipped" ? "rgba(239, 68, 68, 0.1)" : "rgba(34, 197, 94, 0.1)",
                              border: ord.status === "shipped" ? "1px solid rgba(239, 68, 68, 0.3)" : "1px solid rgba(34, 197, 94, 0.3)",
                              color: ord.status === "shipped" ? "#EF4444" : "#22C55E",
                              padding: "8px 16px",
                              borderRadius: "8px",
                              fontSize: "11px",
                              fontWeight: "900",
                              textTransform: "uppercase",
                              cursor: "pointer"
                            }}
                          >
                            {ord.status === "shipped" ? "Mark Processing" : "Mark Shipped"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* PRODUCT GRID */}
        <section style={{ padding: "0 5% 100px", maxWidth: "1400px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {products
              .filter(p => activeTab === "ALL ITEMS" || p.category === activeTab)
              .map((product) => (
                <div 
                  key={product.id} 
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ 
                    background: "#161616", 
                    borderRadius: "32px", 
                    overflow: "hidden", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    display: "flex", 
                    flexDirection: "column",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#FF6A00";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(255, 106, 0, 0.15)";
                    e.currentTarget.style.transform = "translateY(-8px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
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
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
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
                      VIEW DETAILS <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* PREMIUM ELITE CTA */}
        <section style={{ padding: "0 2.5% 120px" }}>
          <div style={{ 
            position: "relative", 
            borderRadius: "40px", 
            overflow: "hidden", 
            minHeight: "500px", 
            display: "flex", 
            alignItems: "center",
            boxShadow: "0 40px 80px rgba(0,0,0,0.8)"
          }}>
            {/* Background Image - Using a placeholder until the final asset is added to the repo */}
            <img 
              src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1600&q=80" 
              alt="Elite Member" 
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} 
            />
            {/* Dark gradient fade from left to right */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.8) 40%, transparent 100%)" }} />

            <div style={{ position: "relative", zIndex: 10, padding: "80px", maxWidth: "800px", textAlign: "left" }}>
              <span style={{ 
                border: "1px solid #FF6A00", 
                color: "#FF6A00", 
                padding: "8px 20px", 
                borderRadius: "100px", 
                fontSize: "11px", 
                fontWeight: "900", 
                letterSpacing: "0.1em",
                display: "inline-block",
                marginBottom: "24px"
              }}>
                LEVEL UP YOUR STATUS
              </span>
              
              <h2 style={{ 
                fontSize: "clamp(60px, 8vw, 100px)", 
                fontWeight: "950", 
                marginBottom: "16px", 
                lineHeight: "0.9", 
                textTransform: "uppercase" 
              }}>
                <ScrollReveal>UNLOCKED</ScrollReveal><br/>
                <span style={{ color: "#FF6A00" }}><ScrollReveal>ACCESS</ScrollReveal></span>
              </h2>
              
              <p style={{ 
                color: "white", 
                fontSize: "18px", 
                maxWidth: "450px", 
                marginBottom: "40px", 
                lineHeight: "1.6",
                fontWeight: "500"
              }}>
                <ScrollReveal>Join the world's ultimate platform for record breakers, elite athletes, and unforgettable achievements.</ScrollReveal>
              </p>

              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <button
                  onClick={() => navigate('/elite')}
                  style={{
                    background: "#FF6A00",
                    color: "white",
                    border: "none",
                    borderRadius: "100px",
                    padding: "16px 32px",
                    fontSize: "14px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(255,106,0,0.3)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  JOIN THE ELITE <Star size={16} fill="white" />
                </button>
                <button
                  onClick={() => navigate('/process')}
                  style={{
                    background: "transparent",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.4)",
                    borderRadius: "100px",
                    padding: "16px 32px",
                    fontSize: "14px",
                    fontWeight: "900",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "all 0.3s"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  LEARN MORE <ArrowRight size={16} />
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
