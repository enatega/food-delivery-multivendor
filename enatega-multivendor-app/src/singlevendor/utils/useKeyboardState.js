import { useEffect, useState } from 'react'
import { Keyboard, Platform } from 'react-native'

function useKeyboardState() {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'

    const showSubscription = Keyboard.addListener(showEvent, (event) => {
      setIsKeyboardVisible(true)
      setKeyboardHeight(event?.endCoordinates?.height || 0)
    })

    const hideSubscription = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false)
      setKeyboardHeight(0)
    })

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  }, [])

  return { isKeyboardVisible, keyboardHeight }
}

export default useKeyboardState
