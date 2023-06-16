import React, { useContext, useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import { useRestaurantContext } from './restaurant'
const SoundContext = React.createContext()
export const SoundContextProvider = ({ children }) => {
  const [sound, setSound] = useState(null)
  const { data } = useRestaurantContext()

  useEffect(() => {
    if (data) {
      const activeOrders =
        data &&
        data.restaurantOrders.filter(order => order.orderStatus === 'PENDING')
      const shouldPlaySound = activeOrders.some(o => o.isRinged)
      if (shouldPlaySound) playSound()
      else stopSound()
    }
  }, [data])
  const playSound = async () => {
    await stopSound()
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/beep.mp3')
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
