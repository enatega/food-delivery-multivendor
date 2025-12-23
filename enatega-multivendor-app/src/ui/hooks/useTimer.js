import { useState, useEffect, useRef, useCallback } from 'react'

export const useTimer = (initialTime = 30, onTimerEnd = () => {}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime)
  const [isActive, setIsActive] = useState(false)
  const intervalRef = useRef(null)
  
  // Memoized start function to prevent unnecessary re-renders
  const start = useCallback(() => {
    if (isActive) return
    
    setIsActive(true)
    setTimeLeft(initialTime)
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    intervalRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current)
          setIsActive(false)
          onTimerEnd()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
  }, [initialTime, isActive, onTimerEnd])
  
  // Memoized reset function
  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    setIsActive(false)
    setTimeLeft(initialTime)
  }, [initialTime])
  
  // Memoized format function
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])
  
  return {
    timeLeft,
    isActive,
    formattedTime: formatTime(timeLeft),
    start,
    reset,
    formattedInitialTime: formatTime(initialTime)
  }
}