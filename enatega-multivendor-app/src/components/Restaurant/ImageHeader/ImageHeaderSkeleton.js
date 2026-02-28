// ImageHeaderSkeleton.js
import React, { useContext } from 'react'
import { View, Platform, Dimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'
import { useNavigation } from '@react-navigation/native'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import styles from './styles'
import { useTranslation } from 'react-i18next'

const { height } = Dimensions.get('screen')
const HEADER_MAX_HEIGHT = Platform.OS === 'android' ? height * 0.65 : height * 0.61

function ImageHeaderSkeleton(props) {
  const { i18n } = useTranslation()
  const navigation = useNavigation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {
    isRTL: i18n.dir() === 'rtl',
    ...theme[themeContext.ThemeValue]
  }

  return (
    <View style={[styles(currentTheme).mainContainer, { height: HEADER_MAX_HEIGHT }]}>
      <View style={[styles().overlayContainer]}>
        <View style={[styles().fixedViewNavigation]}>
          <View style={styles().backIcon}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles(currentTheme).touchArea,
                {
                  borderRadius: props?.iconRadius,
                  height: props?.iconTouchHeight
                }
              ]}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name='arrow-back' color={currentTheme.newIconColor} size={scale(22)} />
            </TouchableOpacity>
          </View>
          <View style={styles().center} />
          <View style={styles().fixedIcons}>
            <View style={[styles(currentTheme).touchArea, { borderRadius: props?.iconRadius }]} />
            <View style={[styles(currentTheme).touchArea, { borderRadius: props?.iconRadius }]} />
          </View>
        </View>

        <View style={[styles().restaurantDetails]}>
          <Placeholder Animation={(props) => <Fade {...props} style={{ backgroundColor: currentTheme.color1 }} duration={600} />}>
            <PlaceholderLine height={scale(250)} style={{ marginBottom: scale(20), borderRadius: 0 }} />
          </Placeholder>
        </View>
      </View>
    </View>
  )
}

export default ImageHeaderSkeleton
