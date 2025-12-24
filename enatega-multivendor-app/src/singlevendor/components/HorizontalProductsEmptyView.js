import { StyleSheet, View } from 'react-native'
import React, { useContext } from 'react'
import { Entypo, FontAwesome6 } from '@expo/vector-icons'
import TextDefault from '../../components/Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'

const HorizontalProductsEmptyView = () => {
  const { i18n, t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue] }

  return (
    <View style={styles().emptyView}>
      <View style={{ alignItems: 'center', gap: 10, padding: 10 }}>
        <FontAwesome6 name='file-excel' size={35} color={currentTheme.primaryBlue} />
        <TextDefault H5 bold textColor={currentTheme.primaryBlue}>
          {t('There is no items for this category')}
        </TextDefault>
      </View>
    </View>
  )
}

export default HorizontalProductsEmptyView

const styles = (currentTheme) =>
  StyleSheet.create({
    emptyView: {
      width: '100%',
      height: 180,
      backgroundColor: '#E0F2FE',
      borderWidth: 1,
      borderColor: '#0EA5E9',
      borderRadius: 10,
      marginHorizontal: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  })
