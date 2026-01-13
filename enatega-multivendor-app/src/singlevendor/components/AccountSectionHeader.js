import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../utils/scaling'

const AccountSectionHeader = ({ currentTheme, onBack, headerText }) => {
  return (
    <View style={styles(currentTheme).header}>
      <TouchableOpacity
        onPress={onBack}
        style={styles(currentTheme).backButton}
        activeOpacity={0.7}
      >
        <View style={styles(currentTheme).backButtonCircle}>
          <AntDesign
            name="arrowleft"
            size={20}
            color={currentTheme.fontMainColor}
          />
        </View>
      </TouchableOpacity>
      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).headerTitle}
        bolder
      >
        {headerText}
      </TextDefault>
      <View style={styles(currentTheme).headerRight} />
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: props?.themeBackground
    },
    backButton: {
      width: scale(40),
      height: scale(40),
      justifyContent: 'center',
      alignItems: 'flex-start'
    },
    backButtonCircle: {
      width: scale(36),
      height: scale(36),
      borderRadius: scale(18),
      backgroundColor: props?.colorBgTertiary || props?.cardBackground || '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    },
    headerTitle: {
      fontSize: scale(18),
      flex: 1,
      textAlign: 'center'
    },
    headerRight: {
      width: scale(40)
    }
  })

export default AccountSectionHeader

