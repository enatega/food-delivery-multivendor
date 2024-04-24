import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { EvilIcons } from '@expo/vector-icons'
import { alignment } from '../../../utils/alignment'
import { scale } from '../../../utils/scaling'

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
    <View style={{...alignment.PLxSmall}}>
      <View style={styles(currentTheme).headerTitleContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent:'center', marginLeft: 5, gap: 5 }}>
          <View style={[styles().locationIcon, props.locationIconGray]}>
            <EvilIcons
              name="location"
              size={scale(20)}
            />
          </View>
          <View style={styles(currentTheme).headerContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={props.modalOn}
              style={styles.textContainer}>
              <TextDefault textColor={props.location} numberOfLines={1} H5 bolder>
                {translatedAddress?.slice(0, 40)}...
              </TextDefault>
            </TouchableOpacity>
            <TextDefault textColor={props.locationLabel} left>
              {''}
              {t(translatedLabel)}
            </TextDefault>
          </View>
        </View>
      </View>
    </View>
  )
}

export default Location
