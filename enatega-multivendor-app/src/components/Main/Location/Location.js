import React, { useRef, useContext, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import i18n from '../../../../i18n'

function Location(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)

  let translatedLabel;
  if (location.label === 'Current Location') {
    translatedLabel = i18n.t('currentLocation');
  } else {
    translatedLabel = i18n.t(location.label);
  }
  const translatedAddress =
    location.deliveryAddress === 'Current Location'
      ? i18n.t('currentLocation')
      : (location.deliveryAddress);

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
              {translatedAddress}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Location
