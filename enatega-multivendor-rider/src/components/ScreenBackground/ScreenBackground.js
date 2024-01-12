import React from 'react'
import { View, StatusBar, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import styles from './style'
import RiderLogin from '../../assets/svg/RiderLogin.png'
import CustomColors from '../../utilities/colors'

const ScreenBackground = ({ children }) => {
  const { colors } = CustomColors()
  return (
    <SafeAreaView style={[styles().flex, styles(colors).bgColor]}>
      <StatusBar
        backgroundColor={styles(colors).bgColor.backgroundColor}
        barStyle="dark-content"
      />
      <View style={styles().container}>
        <Image
          source={RiderLogin}
          style={[styles().image]}
          height={150}
          width={250}
        />
        {children}
      </View>
    </SafeAreaView>
  )
}

export default ScreenBackground
