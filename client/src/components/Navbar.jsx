import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Records", to: "/explore" },
    { label: "Rankings", to: "/leaderboard" },
    { label: "Challenge", to: "/challenge" },
    { label: "Submit", to: "/verify" },
    { label: "Live Events", to: "/events" },
    { label: "Shop", to: "/shop" },
  ];

  if (user && user.isAdmin) {
    navLinks.push({ label: "Admin", to: "/admin" });
  }

  const isActive = (path) => {
    if (path === "/leaderboard") {
      return (
        location.pathname === "/leaderboard" ||
        location.pathname === "/local-leaderboards" ||
        location.pathname === "/global-rankings" ||
        location.pathname === "/global-leaderboard"
      );
    }
    return location.pathname === path;
  };

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
        <div className="nav-pill" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
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
          {user ? (
            <>
              <Link to="/profile" className="desktop-only" style={{ textDecoration: 'none' }}>
                <button className="btn-nav-cta" style={{ color: location.pathname === "/" ? "#111" : "white" }}>
                  Profile
                  <span className="btn-nav-cta-circle"><User style={{ width: 14, height: 14 }} /></span>
                </button>
              </Link>
              <button onClick={logout} className="desktop-only btn-nav-cta" style={{ color: location.pathname === "/" ? "#111" : "white", background: 'transparent', border: 'none' }}>
                Logout
                <span className="btn-nav-cta-circle"><LogOut style={{ width: 14, height: 14 }} /></span>
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
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
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  <button className="btn-nav-cta" style={{ width: "100%", justifyContent: "center", color: location.pathname === "/" ? "#111" : "white" }}>
                    Profile <span className="btn-nav-cta-circle"><User style={{ width: 14, height: 14 }} /></span>
                  </button>
                </Link>
                <button onClick={() => { logout(); setMobileOpen(false); }} className="btn-nav-cta" style={{ width: "100%", justifyContent: "center", color: location.pathname === "/" ? "#111" : "white", background: 'transparent', border: 'none' }}>
                  Logout <span className="btn-nav-cta-circle"><LogOut style={{ width: 14, height: 14 }} /></span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  <button className="btn-nav-cta" style={{ width: "100%", justifyContent: "center", color: location.pathname === "/" ? "#111" : "white" }}>
                    Login <span className="btn-nav-cta-circle"><ArrowRight style={{ width: 14, height: 14 }} /></span>
                  </button>
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} style={{ textDecoration: "none" }}>
                  <button className="btn-nav-cta" style={{ width: "100%", justifyContent: "center", color: location.pathname === "/" ? "#111" : "white" }}>
                    Sign Up <span className="btn-nav-cta-circle"><ArrowRight style={{ width: 14, height: 14 }} /></span>
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
