import { React, useContext } from 'react'
import { View } from 'react-native'
import TextDefault from '../Text/TextDefault/TextDefault'
import { MaterialIcons } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import { useTranslation } from 'react-i18next'
import ErrorSvg from '../../assets/SVG/error'

const ErrorView = () => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const { t } = useTranslation()

  return (
    <View style={styles(currentTheme).errorViewContainer}>
      <ErrorSvg  fill={currentTheme.newIconColor}/>
      <TextDefault center H3 bolder textColor={currentTheme.newFontcolor}>
        {t('somethingWentWrong')}
      </TextDefault>
      <TextDefault center H4 textColor={currentTheme.newFontcolor}>
        {t('checkInternet')}
      </TextDefault>
    </View>
  )
}

export default ErrorView
