import { useCallback, useEffect, useRef } from 'react'

export const useDebounce = (callback, delay) => {
  const callbackRef = useRef(callback)
  const timeoutRef = useRef(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return useCallback((...args) => {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args)
    }, delay)
  }, [delay])
}

