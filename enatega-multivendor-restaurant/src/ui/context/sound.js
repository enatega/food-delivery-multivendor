import React, { createContext, useContext, useEffect, useState } from 'react'
import { Audio } from 'expo-av'
import { useRestaurantContext } from './restaurant'
import AuthContext from '../context/auth'

const SoundContext = createContext()

export const SoundContextProvider = ({ children }) => {
  const [sound, setSound] = useState(null)
  const { data } = useRestaurantContext()
  const { isLoggedIn } = useContext(AuthContext)

  useEffect(() => {
    if (isLoggedIn && data) {
      const activeOrders = data.restaurantOrders.filter(order => order.orderStatus === 'PENDING');
      const shouldPlaySound = activeOrders.some(o => o.isRinged)
      if (shouldPlaySound && !sound) {
        playSound()
      } else if (!shouldPlaySound && sound) {
        stopSound()
      }
    } else {
      stopSound();
    }

    return () => {
      if (sound) {
        stopSound();
      }
    };
  }, [data, isLoggedIn, sound]);

  const playSound = async () => {
    await stopSound()
    const { sound: newSound } = await Audio.Sound.createAsync(
      require('../../assets/beep.mp3')
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
  const stopSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
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
