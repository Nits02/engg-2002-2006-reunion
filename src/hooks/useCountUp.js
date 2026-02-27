import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Animated counter hook – counts from `start` to `end` over `duration` ms.
 * Triggers when the element enters the viewport for the first time,
 * and re-animates from the previous value whenever `end` changes.
 */
export default function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isVisible = useRef(false)
  const prevEnd = useRef(0)

  const animate = useCallback(
    (from, to) => {
      const start = performance.now()

      const step = (now) => {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(from + (to - from) * eased))

        if (progress < 1) requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
    },
    [duration],
  )

  /* Observe viewport entry */
  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible.current) {
          isVisible.current = true
          animate(0, end)
          prevEnd.current = end
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [end, animate])

  /* Re-animate when `end` changes after initial reveal */
  useEffect(() => {
    if (!isVisible.current) return
    if (end === prevEnd.current) return

    animate(prevEnd.current, end)
    prevEnd.current = end
  }, [end, animate])

  return { count, ref }
}
