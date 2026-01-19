import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const SettingsMenuItem = ({ title, subtitle, onPress, currentTheme }) => {
  return (
    <TouchableOpacity
      style={styles(currentTheme).container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles(currentTheme).textContainer}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={styles(currentTheme).title}
          bold
        >
          {title}
        </TextDefault>
        {subtitle && (
          <TextDefault
            textColor={currentTheme.colorTextMuted}
            style={styles(currentTheme).subtitle}
          >
            {subtitle}
          </TextDefault>
        )}
      </View>
      <Ionicons
        name={currentTheme.isRTL ? 'chevron-back' : 'chevron-forward'}
        size={scale(20)}
        color={currentTheme.iconColor}
      />
    </TouchableOpacity>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: verticalScale(16),
      // paddingHorizontal: scale(16),
      backgroundColor: props?.cardBackground || '#FFFFFF'
    },
    textContainer: {
      flex: 1
    },
    title: {
      fontSize: scale(15),
      marginBottom: verticalScale(2)
    },
    subtitle: {
      fontSize: scale(13)
    }
  })

export default SettingsMenuItem
