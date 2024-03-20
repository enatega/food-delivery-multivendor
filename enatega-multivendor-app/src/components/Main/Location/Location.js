import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { EvilIcons } from '@expo/vector-icons'

function Location(props) {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)

  let translatedLabel
  if (location.label === 'Current Location') {
    translatedLabel = t('currentLocation')
  } else {
    translatedLabel = t(location.label)
  }
  const translatedAddress =
    location.deliveryAddress === 'Current Location'
      ? t('currentLocation')
      : location.deliveryAddress

  return (
    <View>
      <View style={styles(currentTheme).headerTitleContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5, gap: 5 }}>
          <View style={[styles().locationIcon, props.locationIconGray]}>
            <EvilIcons
              name="location"
              size={16}
              color={currentTheme.fontFourthColor}
            />
          </View>
          <View style={styles(currentTheme).headerContainer}>
            <TextDefault textColor={props.fontFourthColor} left>
              {''}
              {translatedLabel}
            </TextDefault>
            <TouchableOpacity
              activeOpacity={1}
              onPress={props.modalOn}
              style={styles.textContainer}>
              <TextDefault textColor={props.black} numberOfLines={1} H5 bolder>
                {''}
                {translatedAddress}
              </TextDefault>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Location
