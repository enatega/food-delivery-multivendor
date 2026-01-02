import { useCallback, useRef } from 'react';

export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  // Clean up on unmount
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };
  
  // Create debounced function
  const debouncedCallback = useCallback((...args) => {
    cleanup(); // Clear any existing timeout
    
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
  
  return debouncedCallback;
};