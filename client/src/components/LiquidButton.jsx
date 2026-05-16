import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const LiquidButton = ({ text, to, style, circleStyle, iconSize = 16, className = "" }) => {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <button className={`btn-liquid ${className}`} style={style}>
        {text} 
        <span className="btn-liquid-circle" style={circleStyle}>
          <ArrowRight size={iconSize} />
        </span>
      </button>
    </Link>
  );
};

export default LiquidButton;
