import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { AntDesign } from '@expo/vector-icons'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import styles from '../../screens/ReferAFriend/styles'

const ReferHeader = ({ currentTheme, onBack }) => {
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
      <TextDefault
        textColor={currentTheme.fontMainColor}
        style={styles(currentTheme).headerTitle}
        bolder
      >
        {t('Refer a friend')}
      </TextDefault>
      <View style={styles(currentTheme).headerRight} />
    </View>
  )
}

export default ReferHeader
