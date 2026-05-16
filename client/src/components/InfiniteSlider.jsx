import React from 'react';

export default function InfiniteSlider({ children, gap = 32, speed = 40, reverse = false, cardWidth = "300px" }) {
  // Duplicate children to create a seamless loop
  const duplicatedChildren = [...React.Children.toArray(children), ...React.Children.toArray(children)];

  return (
    <div className="infinite-slider-container" style={{ overflow: 'hidden', width: '100%' }}>
      <div 
        className="infinite-slider-track" 
        style={{ 
          display: 'flex', 
          gap: `${gap}px`,
          width: 'max-content',
          animation: `scroll ${speed}s linear infinite`,
          animationDirection: reverse ? 'reverse' : 'normal'
        }}
      >
        {duplicatedChildren.map((child, index) => (
          <div key={index} style={{ flexShrink: 0, width: cardWidth }}>
            {child}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - ${gap / 2}px)); }
        }
        .infinite-slider-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
