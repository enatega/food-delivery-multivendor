import React, { useContext, useEffect, useState, createContext } from 'react'
import { Audio } from 'expo-av'
import { useUserContext } from './user'
import { AuthContext } from '../context/auth'

const SoundContext = createContext()

export const SoundContextProvider = ({ children }) => {
  const [sound, setSound] = useState(null)
  const { assignedOrders } = useUserContext()
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    if (assignedOrders) {
      // Check if any order should play sound
      const shouldPlaySound = assignedOrders.some(o => o.isRiderRinged && !o.isPickedUp)
      if (shouldPlaySound && !sound) {
        playSound()
      } else if (!shouldPlaySound && sound && logout) {
        stopSound()
      }
    } else {
      stopSound()
    }

    return () => {
      if (sound) {
        stopSound()
      }
    }
  }, [assignedOrders, sound, logout])

  const playSound = async() => {
    await stopSound()
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../assets/beep3.mp3')
    )
    await newSound.setIsLoopingAsync(true)
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: (Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS = 2),
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: (Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = 2),
      playThroughEarpieceAndroid: false
    })
    await newSound.playAsync()
    setSound(newSound)
  }

  const stopSound = async() => {
    if (sound) {
      await sound.unloadAsync()
      setSound(null)
    }
  }
  return (
    <SoundContext.Provider value={{ playSound, stopSound }}>
      {children}
    </SoundContext.Provider>
  )
}
export const SoundContextConsumer = SoundContext.Consumer
export const useSoundContext = () => useContext(SoundContext)
export default SoundContext
