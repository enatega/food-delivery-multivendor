import React, { useRef, useContext, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import {useTranslation} from 'react-i18next'

function Location(props) {
  const {t} = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)

  let translatedLabel;
  if (location.label === 'Current Location') {
    translatedLabel = t('currentLocation');
  } else {
    translatedLabel = t(location.label);
  }
  const translatedAddress =
    location.deliveryAddress === 'Current Location'
      ? t('currentLocation')
      : (location.deliveryAddress);

  const truncatedTranslatedAddress =
      translatedAddress.length > 20
        ? translatedAddress.substring(0, 20) + '...'
        : translatedAddress;
        
  return (
    <View>
      <View style={styles(currentTheme).headerTitleContainer}>
        <View style={styles(currentTheme).headerContainer}>
          <TextDefault textColor={props.style.color} left>
            {''}
            {translatedLabel}
          </TextDefault>
          <TouchableOpacity
            activeOpacity={1}
            onPress={props.modalOn}
            style={styles.textContainer}>
            <TextDefault
              textColor={props.linkColor}
              numberOfLines={1}
              H5
              bolder>
              {''}
              {truncatedTranslatedAddress}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Location
