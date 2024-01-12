import React from 'react'
import { View, StatusBar, Image, Dimensions } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styles from './style'
import WalletBg from '../../assets/svg/WalletBg.png'
import { Ionicons } from '@expo/vector-icons'
import CustomColors from '../../utilities/colors'
import { useNavigation } from '@react-navigation/native'
const { height } = Dimensions.get('window')
const WalletScreenBg = ({ children, backBtn = false }) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const { colors } = CustomColors()
  return (
    <View
      style={[
        styles().flex,
        styles(colors).bgColor,
        { paddingTop: insets.top }
      ]}>
      <StatusBar
        backgroundColor={colors.backgroundColor}
        barStyle="dark-content"
      />
      <View style={styles().container}>
        {backBtn && (
          <View style={styles(colors).icon}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name="chevron-back"
              size={24}
              color={colors.white}
            />
          </View>
        )}
        <Image
          source={WalletBg}
          style={styles().walletImage}
          height={height / 3}
          width={250}
        />
        <View style={styles(colors).innerContainer}>{children}</View>
      </View>
    </View>
  )
}

export default WalletScreenBg
