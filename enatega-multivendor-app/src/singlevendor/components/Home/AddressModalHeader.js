import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useMemo } from 'react'
import styles from './Styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { useTranslation } from 'react-i18next'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../../components/Text/TextDefault/TextDefault'
import { Entypo } from '@expo/vector-icons'

const AddressModalHeader = ({onClose}) => {
  const { t, i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = useMemo(() => ({ isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }), [themeContext.ThemeValue, i18n])
  return (
    <View style={styles.addressContainer}>
      <View style={styles.centerTitleContainer}>
        <TextDefault H3 bolder>
          {t('location')}
        </TextDefault>
      </View>

      <TouchableOpacity hitSlop={10} onPress={() => onClose()} style={styles.closeButton}>
        <Entypo name='cross' size={22} color={currentTheme?.colorTextMuted} />
      </TouchableOpacity>
    </View>
  )
}

export default AddressModalHeader
