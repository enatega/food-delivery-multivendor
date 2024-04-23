import React, { useContext } from 'react'
import { View, TouchableOpacity, Image, StatusBar } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { MaterialIcons } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import styles from './styles'
import { useNavigation } from '@react-navigation/native'
import TextDefault from '../../Text/TextDefault/TextDefault'
import Animated from 'react-native-reanimated'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
const AnimatedIon = Animated.createAnimatedComponent(Ionicons)
function ImageHeader(props) {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const navigation = useNavigation()
  return (
    <>
        <StatusBar
    backgroundColor={currentTheme.themeBackground}
    barStyle={
      themeContext.ThemeValue === 'Dark' ? 'light-content' : 'dark-content'
    }
  />
    <View style={styles(currentTheme).mainContainer}>
      <View style={styles().topBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            backgroundColor: props.iconBackColor,
            color: props.iconColor,
            width: '20%'
          }}
          onPress={() => navigation.goBack()}
        >
          <AnimatedIon color={props.iconColor} name='arrow-back' size={25} />
        </TouchableOpacity>
        <View>
          <TextDefault
            H4
            bolder
            Center
            textColor={currentTheme.fontThirdColor}
            numberOfLines={1}
            ellipsizeMode='tail'
          >
            {props.restaurantName.length > 20
              ? `${props.restaurantName.slice(0, 15)}...`
              : props.restaurantName}
          </TextDefault>
        </View>
        <View style={{ width: '20%' }}></View>
      </View>
    </View>
    </>
  )
}
export default ImageHeader