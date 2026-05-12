import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Records", to: "/explore" },
    { label: "Challenge", to: "/challenge" },
    { label: "Submit", to: "/verify" },
    { label: "Live Events", to: "/events" },
    { label: "Shop", to: "/shop" },
  
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar" style={{ 
      background: location.pathname === "/" ? "rgba(255, 248, 245, 0.85)" : "#000",
      borderColor: location.pathname === "/" ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
    }}>
      <div className="navbar-inner">
        {/* Logo - Left aligned */}
        <div className="nav-logo-wrap">
          <Link to="/" className="nav-logo-link-main">
            <img 
              src={location.pathname === "/" ? "/image copy.png" : "/image copy 6.png"} 
              alt="ROGUE Logo" 
              className="nav-logo-img" 
            />
          </Link>
        </div>

        {/* Desktop nav pill - Center aligned */}
        <div className="nav-pill">
          {navLinks.map((l) => (
            <Link 
              key={l.label} 
              to={l.to} 
              className="nav-pill-item"
              style={{ 
                color: isActive(l.to) ? "white" : (location.pathname === "/" ? "#111" : "white"),
                fontWeight: isActive(l.to) ? "900" : "600",
                background: isActive(l.to) ? "#FF6A00" : "transparent",
                borderRadius: "100px",
                padding: "8px 20px"
              }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Buttons - Right aligned */}
        <div className="nav-btns-wrap">
          <Link to="/login" className="desktop-only">
            <button className="btn-nav-cta" style={{ color: location.pathname === "/" ? "#111" : "white" }}>
              Login
              <span className="btn-nav-cta-circle"><ArrowRight style={{ width: 14, height: 14 }} /></span>
            </button>
          </Link>
          <Link to="/signup" className="desktop-only">
            <button className="btn-nav-cta" style={{ color: location.pathname === "/" ? "#111" : "white" }}>
              Sign Up
              <span className="btn-nav-cta-circle"><ArrowRight style={{ width: 14, height: 14 }} /></span>
            </button>
          </Link>
          <button 
            onClick={() => setMobileOpen(!mobileOpen)} 
            className="hamburger-btn"
            style={{ color: location.pathname === "/" ? "#111" : "white" }}
          >
            {mobileOpen ? <X style={{ width: 22, height: 22 }} /> : <Menu style={{ width: 22, height: 22 }} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu" style={{ background: location.pathname === "/" ? "#FFF8F5" : "#0A0A0A" }}>
          {navLinks.map(l => (
            <Link 
              key={l.label} 
              to={l.to} 
              onClick={() => setMobileOpen(false)} 
              className="mobile-nav-link"
              style={{ color: location.pathname === "/" ? "#111" : "white" }}
            >
              {l.label}
            </Link>
          ))}
          <div className="mobile-menu-footer" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button className="btn-nav-cta" style={{ width: "100%", justifyContent: "center", color: location.pathname === "/" ? "#111" : "white" }}>
                Login <span className="btn-nav-cta-circle"><ArrowRight style={{ width: 14, height: 14 }} /></span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
