import { useEffect, useRef } from 'react'

function useFireworks(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let lastLaunch = 0

    const rockets = []
    const particles = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const randomHue = () => Math.floor(Math.random() * 360)

    const launch = () => {
      const hue = randomHue()
      rockets.push({
        x: canvas.width * (0.15 + Math.random() * 0.7),
        y: canvas.height,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -(canvas.height * 0.012 + Math.random() * canvas.height * 0.008),
        hue,
        trail: [],
      })
    }

    const explode = (rocket) => {
      const count = 70 + Math.floor(Math.random() * 50)
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
        const speed = 1.5 + Math.random() * 3.5
        const hue = rocket.hue + (Math.random() - 0.5) * 40
        particles.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          hue,
          gravity: 0.04 + Math.random() * 0.04,
          drag: 0.97 + Math.random() * 0.015,
          radius: 1.5 + Math.random() * 2,
          fade: 0.01 + Math.random() * 0.008,
        })
      }
    }

    const animate = (timestamp) => {
      // Semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(7, 0, 15, 0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Launch new rocket every ~900ms (staggered)
      if (timestamp - lastLaunch > 900) {
        launch()
        // Sometimes launch two
        if (Math.random() > 0.5) launch()
        lastLaunch = timestamp
      }

      // Update & draw rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i]
        r.trail.push({ x: r.x, y: r.y })
        if (r.trail.length > 10) r.trail.shift()
        r.x += r.vx
        r.y += r.vy
        r.vy += 0.12 // gravity

        // Draw trail
        r.trail.forEach((t, ti) => {
          const a = (ti / r.trail.length) * 0.6
          ctx.beginPath()
          ctx.arc(t.x, t.y, 2.5 * (ti / r.trail.length), 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${r.hue}, 90%, 80%, ${a})`
          ctx.fill()
        })

        // Draw rocket head
        ctx.beginPath()
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${r.hue}, 90%, 90%)`
        ctx.fill()

        // Explode at peak (when vy goes positive)
        if (r.vy >= -0.5) {
          explode(r)
          rockets.splice(i, 1)
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += p.gravity
        p.vx *= p.drag
        p.vy *= p.drag
        p.alpha -= p.fade

        if (p.alpha <= 0) {
          particles.splice(i, 1)
          continue
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 85%, 65%, ${p.alpha})`
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [canvasRef])
}

export default function FinalScreen({ config }) {
  const canvasRef = useRef(null)
  useFireworks(canvasRef)

  return (
    <div className="screen final-screen">
      <canvas ref={canvasRef} className="fireworks-canvas" />
      <div className="final-content">
        <div className="final-card">
          <span className="final-heart" role="img" aria-label="serce">❤️</span>
          <p className="final-text">{config.text}</p>
        </div>
      </div>
    </div>
  )
}
