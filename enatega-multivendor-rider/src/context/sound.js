import React, { useContext, useEffect, useState } from 'react'
import { useTabsContext } from './tabs'
import { Audio } from 'expo-av'
import { useUserContext } from './user'
const SoundContext = React.createContext()
export const SoundContextProvider = ({ children }) => {
  const [sound, setSound] = useState(null)
  const { active } = useTabsContext()
  const { assignedOrders } = useUserContext()
  useEffect(() => {
    if (assignedOrders) {
      const shouldPlaySound = assignedOrders.some(o => o.isRiderRinged)
      if (shouldPlaySound) playSound()
      else stopSound()
    }
  }, [assignedOrders])
  const playSound = async () => {
    if (active === 'NewOrders') {
      await stopSound()
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/beep3.mp3')
      )
      await sound.setIsLoopingAsync(true)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: (Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS = 2),
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: (Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS = 2),
        playThroughEarpieceAndroid: false
      })
      await sound.playAsync()
      setSound(sound)
    }
  }
  const stopSound = async () => {
    await sound?.unloadAsync()
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
