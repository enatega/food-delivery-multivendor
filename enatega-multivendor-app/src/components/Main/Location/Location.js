import React, { useRef, useContext, useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { LocationContext } from '../../../context/Location'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'

function Location(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { location } = useContext(LocationContext)

  return (
    <View>
      <View style={styles(currentTheme).headerTitleContainer}>
        <View style={styles(currentTheme).headerContainer}>
          <TextDefault textColor={props.style.color} left>
            {''}
            {location.label}
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
              {location.deliveryAddress}
            </TextDefault>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Location
