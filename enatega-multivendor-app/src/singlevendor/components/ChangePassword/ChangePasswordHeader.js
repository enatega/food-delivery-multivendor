import React from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { AntDesign } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { scale, verticalScale } from '../../../utils/scaling'

const ChangePasswordHeader = ({ currentTheme, onBack }) => {
  const { t } = useTranslation()

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
      <View style={styles(currentTheme).titleContainer}>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={styles(currentTheme).headerTitle}
          bolder
        >
          {t('changePassword')}
        </TextDefault>
        <TextDefault
          textColor={currentTheme.fontSecondColor}
          style={styles(currentTheme).headerSubtitle}
          bold
        >
          {t('changePasswordDescription')}
        </TextDefault>
      </View>
    </View>
  )
}

const styles = (props = null) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: scale(16),
      paddingVertical: verticalScale(12),
      backgroundColor: props?.themeBackground
    },
    backButton: {
      width: scale(40),
      height: scale(40),
      justifyContent: 'center',
      alignItems: 'flex-start',
      marginBottom: verticalScale(16)
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
    titleContainer: {
      marginBottom: verticalScale(8)
    },
    headerTitle: {
      fontSize: scale(24),
      marginBottom: verticalScale(8)
    },
    headerSubtitle: {
      fontSize: scale(14)
    }
  })

export default ChangePasswordHeader
