import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, ArrowLeft, Trash2, ChevronRight, Plus, Minus, CheckCircle2, Shield } from "lucide-react";
import PageTransition from "../components/PageTransition";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Cart = () => {
  const [items, setItems] = React.useState(() => {
    try {
      const stored = localStorage.getItem("rogue_cart_items");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load cart items from localStorage:", e);
    }
    return [
      {
        id: 1,
        title: "OFFICIAL RECORD CERTIFICATE",
        price: 45.00,
        img: "https://images.unsplash.com/photo-1589330694653-976414ef5ca8?auto=format&fit=crop&w=600&q=80",
        qty: 1
      }
    ];
  });

  React.useEffect(() => {
    localStorage.setItem("rogue_cart_items", JSON.stringify(items));
  }, [items]);

  const [coupon, setCoupon] = React.useState("");
  const [couponMessage, setCouponMessage] = React.useState("");
  const [discount, setDiscount] = React.useState(0);

  const [showCheckout, setShowCheckout] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [cardholderName, setCardholderName] = React.useState("");
  const [cardNumber, setCardNumber] = React.useState("");
  const [expiryDate, setExpiryDate] = React.useState("");
  const [cvv, setCvv] = React.useState("");

  const handleCardNumberChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const limitedVal = rawVal.substring(0, 16);
    let formattedVal = "";
    for (let i = 0; i < limitedVal.length; i++) {
      if (i > 0 && i % 4 === 0) formattedVal += " ";
      formattedVal += limitedVal[i];
    }
    setCardNumber(formattedVal);
  };

  const handleExpiryDateChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, "");
    const limitedVal = rawVal.substring(0, 4);
    let formattedVal = "";
    if (limitedVal.length > 2) {
      formattedVal = `${limitedVal.substring(0, 2)}/${limitedVal.substring(2)}`;
    } else {
      formattedVal = limitedVal;
    }
    setExpiryDate(formattedVal);
  };

  const handleCvvChange = (e) => {
    const cleanCard = cardNumber.replace(/\s/g, "");
    const isAmex = cleanCard.startsWith("34") || cleanCard.startsWith("37");
    const rawVal = e.target.value.replace(/\D/g, "");
    setCvv(rawVal.substring(0, isAmex ? 4 : 3));
  };

  const removeItem = (id, size, color) => {
    setItems(items.filter(item => !(item.id === id && item.size === size && item.color === color)));
  };

  const updateQty = (id, size, color, newQty) => {
    if (newQty < 1) return;
    setItems(items.map(item => {
      if (item.id === id && item.size === size && item.color === color) {
        return { ...item, qty: newQty };
      }
      return item;
    }));
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
                  {items.map(item => {
                    const uniqueKey = `${item.id}-${item.size || ""}-${item.color || ""}`;
                    return (
                      <div key={uniqueKey} style={{ background: "#161616", borderRadius: "24px", padding: "24px", display: "flex", gap: "24px", border: "1px solid rgba(255,255,255,0.05)", transition: "all 0.3s ease" }}>
                        <img src={item.img} alt={item.title} style={{ width: "120px", height: "120px", borderRadius: "16px", objectFit: "cover" }} />
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", alignItems: "flex-start" }}>
                              <h3 style={{ fontSize: "18px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "-0.01em" }}>{item.title}</h3>
                              <div style={{ fontSize: "18px", fontWeight: "900", color: "#FF6A00" }}>${(item.price * item.qty).toFixed(2)}</div>
                            </div>
                            
                            {/* Selected Options Label */}
                            {(item.size || item.color) && (
                              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                                {item.size && <span style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.5)" }}>{item.size}</span>}
                                {item.color && <span style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)", padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "800", color: "rgba(255,255,255,0.5)" }}>{item.color}</span>}
                              </div>
                            )}
                          </div>

                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                            {/* Quantity Controls */}
                            <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.05)", borderRadius: "100px", padding: "4px" }}>
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)}
                                style={{ background: "transparent", border: "none", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                <Minus size={12} />
                              </button>
                              <span style={{ color: "white", width: "32px", textAlign: "center", fontSize: "12px", fontWeight: "900" }}>{item.qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)}
                                style={{ background: "transparent", border: "none", color: "white", width: "28px", height: "28px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button 
                              type="button"
                              onClick={() => removeItem(item.id, item.size, item.color)}
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
                              <Trash2 size={14} /> REMOVE
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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
                {items.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    {items.map(item => (
                      <div key={`summary-${item.id}-${item.size || ""}-${item.color || ""}`} style={{ display: "flex", justifyContent: "space-between", color: "white", fontSize: "13px" }}>
                        <span style={{ fontWeight: "700" }}>{item.qty}x {item.title}</span>
                        <span style={{ color: "rgba(255,255,255,0.7)" }}>${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
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

              <button 
                onClick={() => {
                  if (items.length > 0) {
                    setCardholderName("");
                    setCardNumber("");
                    setExpiryDate("");
                    setCvv("");
                    setShowCheckout(true);
                  }
                }}
                style={{ width: "100%", background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: items.length > 0 ? "pointer" : "not-allowed", opacity: items.length > 0 ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", transition: "all 0.3s" }} 
                onMouseEnter={e => { if(items.length > 0) { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(255,106,0,0.3)"; } }} 
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              >
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

        {/* SECURE CHECKOUT MODAL OVERLAY */}
        {showCheckout && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0, 0, 0, 0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: "20px" }}>
            <div style={{ background: "#161616", border: "1px solid rgba(255, 106, 0, 0.2)", borderRadius: "32px", width: "100%", maxWidth: "500px", padding: "40px", position: "relative", boxShadow: "0 30px 60px rgba(0, 0, 0, 0.8), 0 0 100px rgba(255, 106, 0, 0.05)", color: "white", maxHeight: "90vh", overflowY: "auto" }}>
              <button 
                type="button"
                onClick={() => { setShowCheckout(false); setIsSuccess(false); setIsProcessing(false); }}
                style={{ position: "absolute", top: "24px", right: "24px", background: "rgba(255,255,255,0.05)", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", cursor: "pointer", fontWeight: "bold", fontSize: "16px" }}
              >
                ✕
              </button>

              {isSuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ width: "80px", height: "80px", background: "rgba(255, 106, 0, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", border: "2px solid #FF6A00" }}>
                    <CheckCircle2 size={48} color="#FF6A00" />
                  </div>
                  <h3 style={{ fontSize: "28px", fontWeight: "950", textTransform: "uppercase", marginBottom: "16px" }}>PAYMENT SUCCESSFUL</h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "15px", lineHeight: "1.6", marginBottom: "32px" }}>
                    {(() => {
                      const hasPass = items.some(item => item.title.toLowerCase().includes("spectator pass"));
                      const hasOtherItems = items.some(item => !item.title.toLowerCase().includes("spectator pass"));
                      
                      if (hasPass && !hasOtherItems) {
                        return "Thank you! Your order has been processed securely. Your spectator passes will be activated shortly.";
                      } else if (!hasPass && hasOtherItems) {
                        return "Thank you! Your order has been processed securely. Your items will be processed and shipped shortly.";
                      } else {
                        return "Thank you! Your order has been processed securely. Your items will be shipped shortly and your spectator passes will be activated shortly.";
                      }
                    })()}
                  </p>
                  <button 
                    type="button"
                    onClick={() => { setShowCheckout(false); setIsSuccess(false); setItems([]); localStorage.removeItem("rogue_cart_items"); }}
                    style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "16px 36px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", boxShadow: "0 10px 20px rgba(255,106,0,0.3)" }}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              ) : isProcessing ? (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <div style={{ width: "50px", height: "50px", border: "4px solid rgba(255,106,0,0.1)", borderTop: "4px solid #FF6A00", borderRadius: "50%", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
                  <h3 style={{ fontSize: "20px", fontWeight: "900", textTransform: "uppercase", marginBottom: "12px" }}>PROCESSING SECURE PAYMENT</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px" }}>Verifying card details with payment gateway...</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => { e.preventDefault(); setIsProcessing(true); setTimeout(() => { setIsProcessing(false); setIsSuccess(true); }, 2000); }}
                  style={{ display: "flex", flexDirection: "column", gap: "24px" }}
                >
                  <div>
                    <span style={{ fontSize: "11px", fontWeight: "900", color: "#FF6A00", letterSpacing: "0.1em", textTransform: "uppercase" }}>SECURE CHECKOUT</span>
                    <h3 style={{ fontSize: "24px", fontWeight: "950", textTransform: "uppercase", marginTop: "4px" }}>ORDER SUMMARY</h3>
                  </div>

                  <div style={{ background: "rgba(255, 106, 0, 0.05)", border: "1px dashed rgba(255, 106, 0, 0.2)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                    {items.map((item, i) => (
                      <div key={`modal-${item.id}-${i}`} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ textAlign: "left" }}>
                          <div style={{ fontSize: "14px", fontWeight: "800", color: "white" }}>{item.qty}x {item.title}</div>
                        </div>
                        <div style={{ textAlign: "right", fontSize: "14px", fontWeight: "900", color: "#FF6A00" }}>
                          ${(item.price * item.qty).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    {discount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#22c55e" }}>Discount</div>
                        <div style={{ fontSize: "14px", fontWeight: "900", color: "#22c55e" }}>-${discount.toFixed(2)}</div>
                      </div>
                    )}
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "12px", display: "flex", justifyContent: "space-between", marginTop: "4px" }}>
                      <div style={{ fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)" }}>TOTAL DUE</div>
                      <div style={{ fontSize: "20px", fontWeight: "950", color: "#FF6A00" }}>${total.toFixed(2)}</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ textAlign: "left" }}>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase" }}>CARDHOLDER NAME</label>
                      <input type="text" placeholder="John Doe" value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} required style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "13px" }} />
                    </div>
                    <div style={{ textAlign: "left" }}>
                      <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase" }}>CARD NUMBER</label>
                      <input type="text" placeholder="•••• •••• •••• ••••" value={cardNumber} onChange={handleCardNumberChange} required style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "13px" }} />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", textAlign: "left" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase" }}>EXPIRY DATE</label>
                        <input type="text" placeholder="MM/YY" value={expiryDate} onChange={handleExpiryDateChange} required style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "13px" }} />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "10px", fontWeight: "900", color: "rgba(255,255,255,0.4)", marginBottom: "8px", textTransform: "uppercase" }}>CVV</label>
                        <input type="text" placeholder="•••" value={cvv} onChange={handleCvvChange} required style={{ width: "100%", background: "#0A0A0A", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "14px 18px", color: "white", outline: "none", fontSize: "13px" }} />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    style={{ background: "#FF6A00", color: "white", border: "none", borderRadius: "100px", padding: "18px", fontSize: "14px", fontWeight: "900", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", boxShadow: "0 10px 20px rgba(255,106,0,0.3)", marginTop: "8px" }}
                  >
                    <span>SECURELY PAY ${total.toFixed(2)}</span> <Shield size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </PageTransition>
  );
};

export default Cart;
