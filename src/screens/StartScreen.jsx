import { useState } from 'react'

function HeartSVG() {
  return (
    <svg viewBox="0 0 100 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="heartG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f78fb3" />
          <stop offset="50%" stopColor="#e8a0bf" />
          <stop offset="100%" stopColor="#c47ab7" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Heart path */}
      <path
        d="M50,80
          C30,65 5,50 5,28
          C5,12 16,4 28,4
          C36,4 44,8 50,16
          C56,8 64,4 72,4
          C84,4 95,12 95,28
          C95,50 70,65 50,80 Z"
        fill="url(#heartG)"
        filter="url(#glow)"
      />
      {/* Shine */}
      <ellipse cx="36" cy="24" rx="10" ry="6" fill="white" opacity="0.2" transform="rotate(-30, 36, 24)" />
    </svg>
  )
}

export default function StartScreen({ onStart }) {
  const [spinning, setSpinning] = useState(false)

  const handleStart = () => {
    if (spinning) return
    setSpinning(true)
    setTimeout(() => {
      onStart()
    }, 600)
  }

  return (
    <div className="screen start-screen">
      <div className={`heart-container ${spinning ? 'spinning' : ''}`}>
        <HeartSVG />
      </div>
      <p className="start-subtitle">dla Ciebie, z miłością ❤</p>
      <button
        className="btn-primary"
        onClick={handleStart}
        disabled={spinning}
      >
        Start
      </button>
    </div>
  )
}
