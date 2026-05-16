import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#fff',
  bgColor = '#1E1712',
  marqueeBgColor = '#FF6A00',
  marqueeTextColor = '#fff',
  borderColor = 'rgba(255,255,255,0.1)'
}) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: bgColor }}>
      <nav style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: 0, padding: 0 }}>
        {items.map((item, idx) => (
          <MenuItem
            key={idx}
            {...item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            isFirst={idx === 0}
          />
        ))}
      </nav>
    </div>
  );
}

function MenuItem({ link, text, images = [], label, speed, textColor, marqueeBgColor, marqueeTextColor, borderColor, isFirst }) {
  const itemRef = useRef(null);
  const marqueeRef = useRef(null);
  const marqueeInnerRef = useRef(null);

  const animationDefaults = { duration: 0.6, ease: 'expo' };

  const findClosestEdge = (mouseX, mouseY, width, height) => {
    const topEdgeDist = (mouseX - width / 2) ** 2 + mouseY ** 2;
    const bottomEdgeDist = (mouseX - width / 2) ** 2 + (mouseY - height) ** 2;
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const handleMouseEnter = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap.timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = ev => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const edge = findClosestEdge(ev.clientX - rect.left, ev.clientY - rect.top, rect.width, rect.height);
    gsap.timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  return (
    <div
      ref={itemRef}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        borderTop: isFirst ? 'none' : `1px solid ${borderColor}`,
      }}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-16.6667%); }
        }
        .marquee-animation {
          animation: marquee ${speed}s linear infinite;
        }
      `}</style>

      <a
        href={link}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          height: '100%',
          position: 'relative',
          cursor: 'pointer',
          textDecoration: 'none',
          color: textColor,
          fontWeight: 900,
          fontSize: 'clamp(32px, 5vw, 64px)',
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <span style={{ color: '#FF6A00', fontSize: '0.55em', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {label}
        </span>
        {text}
      </a>

      {/* Marquee overlay */}
      <div
        ref={marqueeRef}
        style={{
          position: 'absolute', top: 0, left: 0,
          width: '100%', height: '100%',
          overflow: 'hidden', pointerEvents: 'none',
          transform: 'translateY(101%)',
          backgroundColor: marqueeBgColor,
        }}
      >
        <div 
          ref={marqueeInnerRef} 
          className="marquee-animation"
          style={{ 
            height: '100%', 
            width: 'fit-content', 
            display: 'flex',
            willChange: 'transform'
          }}
        >
          {/* Duplicate for seamless infinite loop — 6 copies ensures no visible end */}
          {[...Array(6)].map((_, repIdx) => (
            <div
              className="marquee-part"
              key={repIdx}
              style={{ display: 'flex', alignItems: 'center', flexShrink: 0, color: marqueeTextColor }}
            >
              {images.map((img, imgIdx) => (
                <div key={imgIdx} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    whiteSpace: 'nowrap', textTransform: 'uppercase',
                    fontWeight: 900, fontSize: 'clamp(28px, 4vh, 56px)',
                    lineHeight: 1, padding: '0 2vw',
                    letterSpacing: '-0.02em',
                    fontFamily: "'Inter', sans-serif",
                  }}>
                    {text}
                  </span>
                  <div style={{
                    width: 110,
                    height: 56,
                    margin: '0 12px',
                    borderRadius: 56,
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    flexShrink: 0,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                  }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FlowingMenu;
