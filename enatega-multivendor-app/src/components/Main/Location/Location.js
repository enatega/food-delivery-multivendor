import React, { useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import { Feather } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'

function Location({
  navigation,
  addresses,
  locationIconGray,
  modalOn,
  location: locationParam,
  locationLabel,
  forwardIcon = false,
  screenName }) {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL : i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}
  const { location } = useContext(LocationContext)

  let translatedLabel
  if (location?.label === 'Current Location') {
    translatedLabel = t('currentLocation')
  } else {
    translatedLabel = t(location?.label)
  }
  const translatedAddress =
    location?.deliveryAddress === 'Current Location'
      ? t('currentLocation')
      : location?.deliveryAddress
  const onLocationPress = (event) => {

    if (screenName === 'checkout') {
      if (addresses && !addresses.length) {
        navigation.navigate('AddNewAddress', {
          prevScreen: 'Checkout',
          latitude: location.latitude,
          longitude: location.longitude
        })
      } else {
        navigation.navigate('CartAddress', {
          address: location
        })
      }
    }
    else
      modalOn()
  }
  return (
    <TouchableOpacity onPress={onLocationPress} >
      <View style={styles(currentTheme).headerTitleContainer}>
        <View
          style={[
            styles(currentTheme).row,
            {
              flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row'
            }
          ]}
        >
          <View style={[styles(currentTheme).locationIcon, locationIconGray]}>
            {location?.label === 'Current Location' ||
            location?.deliveryAddress === 'Current Location' ? (
              <Feather
                name="crosshair"
                size={scale(18)}
                color={currentTheme.secondaryText}
              />
            ) : (
              <Feather
                name='map-pin'
                size={scale(17)}
                color={currentTheme.secondaryText}
              />
            )}
          </View>
          <View style={styles(currentTheme).headerContainer}>
            <View style={styles(currentTheme).titleWrap}>
              <TextDefault textColor={locationParam} numberOfLines={1} H5 bolder isRTL style={styles(currentTheme).titleText}>
                {translatedAddress?.length > 40
                  ? `${translatedAddress.slice(0, 40)}...`
                  : translatedAddress}
              </TextDefault>
            </View>
            <TextDefault textColor={locationLabel} left isRTL style={styles(currentTheme).subtitleText}>
              {''}
              {t(translatedLabel)}
            </TextDefault>
          </View>
          {forwardIcon && <Feather
            name= {currentTheme?.isRTL ? 'chevron-left' : 'chevron-right'}
            size={20}
            color={currentTheme.secondaryText}
          />}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Location
