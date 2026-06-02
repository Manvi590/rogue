import React from 'react';

export default function InfiniteSlider({ children, gap = 32, speed = 40, reverse = false, cardWidth = "300px" }) {
  const originalChildren = React.Children.toArray(children);
  const originalCount = originalChildren.length;
  
  if (originalCount === 0) return null;

  const cardWidthNum = parseInt(cardWidth) || 300;
  const loopWidth = originalCount * (cardWidthNum + gap);
  
  // Duplicate 12 times to ensure it fully fills even ultra-wide screens across multiple loops
  const duplicatedChildren = Array(12).fill(originalChildren).flat();

  return (
    <div className="infinite-slider-container" style={{ overflow: 'hidden', width: '100%' }}>
      <div 
        className="infinite-slider-track" 
        style={{ 
          display: 'flex', 
          gap: `${gap}px`,
          width: 'max-content',
          animation: `scroll-${loopWidth} ${speed}s linear infinite`,
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
        @keyframes scroll-${loopWidth} {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${loopWidth}px); }
        }
        .infinite-slider-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
