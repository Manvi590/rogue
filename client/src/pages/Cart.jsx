import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, ChevronRight } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cart = () => {
  const [items, setItems] = React.useState([
    {
      id: 1,
      title: "OFFICIAL RECORD CERTIFICATE",
      price: 45.00,
      img: "https://images.unsplash.com/photo-1589330694653-976414ef5ca8?auto=format&fit=crop&w=600&q=80",
      qty: 1
    }
  ]);

  const [coupon, setCoupon] = React.useState("");
  const [couponMessage, setCouponMessage] = React.useState("");
  const [discount, setDiscount] = React.useState(0);

  const removeItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0);

  const applyCoupon = () => {
    if (!coupon.trim()) return;
    if (coupon.toUpperCase() === "ROGUE20" || coupon.toUpperCase() === "ELITE20") {
      setDiscount(subtotal * 0.20);
      setCouponMessage("✓ 20% DISCOUNT APPLIED!");
    } else {
      setDiscount(0);
      setCouponMessage("✗ Invalid coupon code.");
    }
  };

  const total = Math.max(0, subtotal - discount);

  return (
    <PageTransition>
      <div style={{ background: "#0A0A0A", color: "white", minHeight: "100vh", fontFamily: "'Inter', sans-serif", display: "flex", flexDirection: "column" }}>
        <Navbar />

        <div style={{ padding: "180px 5% 120px", maxWidth: "1200px", margin: "0 auto", flex: 1 }}>
          <Link to="/shop" style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.4)", textDecoration: "none", fontSize: "14px", fontWeight: "700", marginBottom: "40px", transition: "color 0.2s" }} onMouseEnter={e => e.currentTarget.style.color = "white"} onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}>
            <ArrowLeft size={16} /> BACK TO SHOP
          </Link>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "60px" }}>
            
            {/* ITEM LIST */}
            <div>
              <h1 style={{ fontSize: "40px", fontWeight: "950", textTransform: "uppercase", marginBottom: "40px" }}>YOUR SHOPPING <span style={{ color: "#FF6A00" }}>BAG</span></h1>
              
              {items.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  {items.map(item => (
                    <div key={item.id} style={{ background: "#161616", borderRadius: "24px", padding: "24px", display: "flex", gap: "24px", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s ease" }}>
                      <img src={item.img} alt={item.title} style={{ width: "120px", height: "120px", borderRadius: "16px", objectFit: "cover" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                          <h3 style={{ fontSize: "18px", fontWeight: "900", textTransform: "uppercase" }}>{item.title}</h3>
                          <div style={{ fontSize: "18px", fontWeight: "900", color: "#FF6A00" }}>${item.price.toFixed(2)}</div>
                        </div>
                        <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "24px" }}>Quantity: {item.qty}</div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          style={{ 
                            background: "rgba(255,255,255,0.03)", 
                            border: "1px solid rgba(255,255,255,0.05)", 
                            color: "rgba(255,255,255,0.5)", 
                            padding: "8px 16px",
                            borderRadius: "10px",
                            cursor: "pointer", 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px", 
                            fontSize: "11px", 
                            fontWeight: "800",
                            transition: "all 0.2s"
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                            e.currentTarget.style.color = "#ef4444";
                            e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.2)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                            e.currentTarget.style.color = "rgba(255,255,255,0.5)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                          }}
                        >
                          <Trash2 size={14} /> REMOVE ITEM
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "100px 0", background: "#111", borderRadius: "32px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                  <ShoppingBag size={64} style={{ opacity: 0.1, marginBottom: "24px", color: "#FF6A00" }} />
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "18px", fontWeight: "700", marginBottom: "32px" }}>Your bag is empty.</p>
                  <Link to="/shop" style={{ textDecoration: "none" }}>
                    <button style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "16px 32px", fontWeight: "900", fontSize: "14px", cursor: "pointer" }}>CONTINUE SHOPPING</button>
                  </Link>
                </div>
              )}
            </div>

            {/* SUMMARY */}
            <div style={{ background: "#161616", borderRadius: "32px", padding: "40px", height: "fit-content", border: "1px solid rgba(255,255,255,0.05)" }}>
              <h2 style={{ fontSize: "20px", fontWeight: "900", textTransform: "uppercase", marginBottom: "32px" }}>ORDER SUMMARY</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#22c55e", fontSize: "14px", fontWeight: "700" }}>
                    <span>Discount (20% Off)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "20px", fontWeight: "900" }}>
                  <span>TOTAL</span>
                  <span style={{ color: "#FF6A00" }}>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Add Coupon Code section */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "24px", marginBottom: "32px" }}>
                <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "8px" }}>
                  Add Coupon Code
                </label>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.5", marginBottom: "16px" }}>
                  If you currently have a coupon code, you can place it here and redeem it.
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input 
                    type="text" 
                    placeholder="ROGUE20" 
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    style={{ 
                      flex: 1, 
                      background: "rgba(0,0,0,0.3)", 
                      border: "1px solid rgba(255,255,255,0.05)", 
                      borderRadius: "12px", 
                      padding: "12px 16px", 
                      color: "white", 
                      fontSize: "13px", 
                      fontWeight: "700", 
                      outline: "none" 
                    }}
                  />
                  <button 
                    type="button"
                    onClick={applyCoupon}
                    style={{ 
                      background: "#FF6A00", 
                      color: "white", 
                      border: "none", 
                      borderRadius: "12px", 
                      padding: "12px 24px", 
                      fontSize: "12px", 
                      fontWeight: "900", 
                      textTransform: "uppercase", 
                      cursor: "pointer",
                      transition: "all 0.2s" 
                    }}
                  >
                    REDEEM
                  </button>
                </div>
                {couponMessage && (
                  <div style={{ marginTop: "10px", fontSize: "12px", fontWeight: "800", color: couponMessage.includes("Invalid") ? "#ef4444" : "#22c55e", textTransform: "uppercase" }}>
                    {couponMessage}
                  </div>
                )}
              </div>

              <button style={{ width: "100%", background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.3s" }} onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,106,0,0.3)"; }} onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}>
                CHECKOUT <ChevronRight size={18} />
              </button>

              <Link to="/shop" style={{ textDecoration: "none" }}>
                <button 
                  type="button"
                  style={{ 
                    width: "100%", 
                    background: "rgba(255,255,255,0.03)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    color: "white", 
                    borderRadius: "100px", 
                    padding: "16px", 
                    fontSize: "13px", 
                    fontWeight: "900", 
                    textTransform: "uppercase", 
                    cursor: "pointer", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    gap: "8px", 
                    marginTop: "16px",
                    transition: "all 0.3s" 
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <ArrowLeft size={16} /> CONTINUE SHOPPING
                </button>
              </Link>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Cart;
