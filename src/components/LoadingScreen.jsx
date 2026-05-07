import React, { useEffect, useState } from 'react'

export default function LoadingScreen({ onFinish }) {
  const [slideUp, setSlideUp] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let startTime = null
    const duration = 1400 // Quick 1.4s count to 100
    let animationFrameId

    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      
      const currentProgress = Math.min(Math.floor((elapsed / duration) * 100), 100)
      setProgress(currentProgress)

      if (elapsed < duration) {
        animationFrameId = requestAnimationFrame(animateProgress)
      }
    }

    animationFrameId = requestAnimationFrame(animateProgress)

    // Slide up shortly after hitting 100%
    const slideUpTimer = setTimeout(() => {
      setSlideUp(true)
    }, 1500)

    // Unmount
    const finishTimer = setTimeout(() => {
      onFinish()
    }, 2200)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearTimeout(slideUpTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#000',
        transform: slideUp ? 'translateY(-100vh)' : 'translateY(0)',
        transition: 'transform 0.7s cubic-bezier(0.76, 0, 0.24, 1)',
        pointerEvents: slideUp ? 'none' : 'auto'
      }}
    >
      <div style={{
        position: 'absolute',
        bottom: '8%',
        left: '5%',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        {/* Creative detail text */}
        <div style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: 'clamp(11px, 2vw, 14px)',
          fontWeight: '700',
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          marginBottom: '8px',
          animation: 'pulse 1.4s ease-in-out infinite'
        }}>
          Preparing Stage
        </div>
        
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '8px'
        }}>
          <div style={{
            color: '#FF6A00',
            fontSize: 'clamp(80px, 15vw, 160px)',
            fontWeight: '900',
            lineHeight: '0.8',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.04em'
          }}>
            {progress}
          </div>
          <div style={{
            color: '#FF6A00',
            fontSize: 'clamp(30px, 5vw, 50px)',
            fontWeight: '800'
          }}>
            %
          </div>
        </div>
      </div>

      {/* Growing progress bar line at the very bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: '6px',
        background: '#FF6A00',
        width: `${progress}%`,
        transition: 'width 0.1s linear'
      }} />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
