import { animate, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { useEffect, useState } from 'react'
import { formatPrecio } from '../../lib/format'

interface AnimatedNumberProps {
  value: number
  className?: string
}

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const mv = useMotionValue(value)
  const [text, setText] = useState(() => formatPrecio(value))

  useMotionValueEvent(mv, 'change', (latest) => {
    setText(formatPrecio(latest))
  })

  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.35, ease: 'easeOut' })
    return () => controls.stop()
  }, [value, mv])

  return <span className={className}>{text}</span>
}
