import { useEffect, useMemo, useState } from 'react'

const toRemainingMinutes = value => {
  if (!value) return 0
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return 0

  if (numericValue > 10000000000) {
    return Math.max(Math.ceil((numericValue - Date.now()) / 60000), 0)
  }

  return Math.max(Math.ceil(numericValue), 0)
}

export const useTimer = initialValue => {
  const [timeLeft, setTimeLeft] = useState(() =>
    toRemainingMinutes(initialValue)
  )

  useEffect(() => {
    setTimeLeft(toRemainingMinutes(initialValue))
  }, [initialValue])

  useEffect(() => {
    if (timeLeft <= 0) return undefined
    const interval = setInterval(() => {
      setTimeLeft(current => Math.max(current - 1, 0))
    }, 60000)
    return () => clearInterval(interval)
  }, [timeLeft > 0])

  return useMemo(() => ({ timeLeft }), [timeLeft])
}

