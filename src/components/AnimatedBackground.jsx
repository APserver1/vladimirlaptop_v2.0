import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'

// Generate a random path of waypoints for each orb
const generatePath = (containerW, containerH, orbSize) => {
  const points = []
  const numPoints = 8
  const maxX = containerW - orbSize
  const maxY = containerH - orbSize
  for (let i = 0; i < numPoints; i++) {
    points.push({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    })
  }
  return points
}

const AnimatedBackground = () => {
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollVelocity, setScrollVelocity] = useState(0)
  const [size, setSize] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight })
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Scroll detection - measure velocity and flag "actively scrolling"
  useEffect(() => {
    let lastY = window.scrollY
    let lastTime = performance.now()
    let frame

    const onScroll = () => {
      const now = performance.now()
      const dy = window.scrollY - lastY
      const dt = now - lastTime
      if (dt > 0) {
        const v = Math.abs(dy / dt) // px per ms
        setScrollVelocity((prev) => prev * 0.6 + v * 0.4)
      }
      lastY = window.scrollY
      lastTime = now
      setIsScrolling(true)
      clearTimeout(window.__scrollStopTimer)
      window.__scrollStopTimer = setTimeout(() => setIsScrolling(false), 180)
      if (!frame) {
        frame = requestAnimationFrame(() => { frame = null })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(window.__scrollStopTimer)
    }
  }, [])

  // Compute paths once the viewport is known
  const orbs = useMemo(() => {
    if (!size.w) return []
    return [
      {
        cls: 'a',
        size: 480,
        baseDuration: 26,
        path: generatePath(size.w, size.h, 480),
      },
      {
        cls: 'b',
        size: 400,
        baseDuration: 30,
        path: generatePath(size.w, size.h, 400),
      },
      {
        cls: 'c',
        size: 320,
        baseDuration: 22,
        path: generatePath(size.w, size.h, 320),
      },
      {
        cls: 'd',
        size: 360,
        baseDuration: 34,
        path: generatePath(size.w, size.h, 360),
      },
    ]
  }, [size])

  // Speed multiplier: x1 idle, x2 when scrolling, with extra punch from velocity
  const speedMultiplier = isScrolling
    ? Math.min(2 + Math.min(scrollVelocity, 2) * 0.5, 3)
    : 1

  return (
    <div className="bg-fx" aria-hidden="true">
      <div className="bg-grid" />
      {orbs.map((orb, i) => (
        <motion.div
          key={orb.cls}
          className={`bg-orb ${orb.cls}`}
          style={{
            width: orb.size,
            height: orb.size,
            willChange: 'transform',
          }}
          animate={{
            x: orb.path.map((p) => p.x),
            y: orb.path.map((p) => p.y),
            scale: [1, 1.06, 0.96, 1.02, 1],
          }}
          transition={{
            duration: orb.baseDuration / speedMultiplier,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            times: orb.path.map((_, idx) => idx / (orb.path.length - 1)),
            delay: i * -3,
          }}
        />
      ))}
    </div>
  )
}

export default AnimatedBackground
