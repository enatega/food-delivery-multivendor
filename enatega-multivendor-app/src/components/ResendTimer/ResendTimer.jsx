import React, { useEffect, useRef } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useTimer } from '../../ui/hooks/useTimer'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'

const ResendTimer = ({ duration = 30, onResend, currentTheme, autoStart = true }) => {
  const { formattedTime, isActive, start } = useTimer(duration)
  const startedRef = useRef(false)

  useEffect(() => {
    // Only start once, even if component re-renders
    if (autoStart && !startedRef.current) {
      startedRef.current = true
      start()
    }
  }, [autoStart])

  const handleResend = () => {
    start()
    if (onResend) {
      onResend()
    }
  }

  return (
    <View style={{ ...alignment.MTmedium }}>
      {isActive ? (
        <TextDefault bold textColor={currentTheme.horizontalLine} style={{ ...alignment.MBmedium }}>
          Didn't receive the code? Resend OTP in {formattedTime}
        </TextDefault>
      ) : (
        <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
          <TextDefault bold textColor={currentTheme.horizontalLine}>
            Didn't receive the code? <TextDefault H5 bolder textColor={currentTheme.horizontalLine}>Resend OTP</TextDefault>
          </TextDefault>
        </TouchableOpacity>
      )}
    </View>
  )
}

// Prevent unnecessary re-renders from parent
export default React.memo(ResendTimer)
