import React, { useState } from 'react'
import { View, StatusBar, Image, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './style'
import RiderLogin from '../../assets/svg/RiderLogin.png'
import { ResizeMode, Video } from 'expo-av'

const ScreenBackground = ({ children, demoLink }) => {
  const [showVideo, setShowVideo] = useState(false)
  return (
    <SafeAreaView style={[styles.flex, styles.bgColor]}>
      <StatusBar
        backgroundColor={styles.bgColor.backgroundColor}
        barStyle="dark-content"
      />
      <View style={styles.container}>
        {(showVideo && demoLink) ? <Video
          style={styles.video}
          source={{
            uri: demoLink
          }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
        /> : <Image
          source={RiderLogin}
          style={[styles.image]}
          height={150}
          width={250}
        />}
        {demoLink && <Button
          title={showVideo ? 'Stop' : 'Demo?'}
          onPress={() => { setShowVideo(!showVideo) }}/>}
        {children}
      </View>
    </SafeAreaView>
  )
}

export default ScreenBackground
