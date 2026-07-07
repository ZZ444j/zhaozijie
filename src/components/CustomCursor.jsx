import { useEffect, useState } from 'react'
import { motion, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [clicked, setClicked] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (isTouch) return null

  const springX = useSpring(0, { stiffness: 200, damping: 25 })
  const springY = useSpring(0, { stiffness: 200, damping: 25 })
  const trailX = useSpring(0, { stiffness: 80, damping: 30 })
  const trailY = useSpring(0, { stiffness: 80, damping: 30 })

  useEffect(() => {
    const move = (e) => {
      springX.set(e.clientX)
      springY.set(e.clientY)
      trailX.set(e.clientX)
      trailY.set(e.clientY)
      setPos({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }
    const down = () => setClicked(true)
    const up = () => setClicked(false)
    const leave = () => setHidden(true)
    const enter = () => setHidden(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)
    document.addEventListener('mouseleave', leave)
    document.addEventListener('mouseenter', enter)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
      document.removeEventListener('mouseleave', leave)
      document.removeEventListener('mouseenter', enter)
    }
  }, [springX, springY, trailX, trailY])

  if (typeof window === 'undefined') return null

  return (
    <>
      {/* Trail glow */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
      >
        <div
          className="rounded-full bg-primary/15 blur-xl transition-opacity duration-300"
          style={{
            width: 60,
            height: 60,
            opacity: hidden ? 0 : 1,
          }}
        />
      </motion.div>

      {/* Main cursor dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: springX, y: springY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          animate={{
            scale: clicked ? 0.6 : 1,
            width: clicked ? 24 : 12,
            height: clicked ? 24 : 12,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="rounded-full bg-white"
          style={{
            width: 12,
            height: 12,
            opacity: hidden ? 0 : 1,
            boxShadow: '0 0 20px rgba(99,102,241,0.6), 0 0 60px rgba(6,182,212,0.3)',
          }}
        />
      </motion.div>
    </>
  )
}
