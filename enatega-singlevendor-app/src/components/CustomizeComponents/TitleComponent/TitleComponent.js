import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'
import useMultivendorTheme from '../../../ui/designSystem/useMultivendorTheme'

function TitleComponent(props) {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const currentTheme = { isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue], ...tokens }

  return (
    <View style={styles(currentTheme).mainContainer}>
      <View style={styles(currentTheme).textContainer}>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.colors.textPrimary}
          H6
          bolder
          isRTL>
          {props?.title}
        </TextDefault>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.colors.textMuted}
          small
          isRTL
        >
          {props?.subTitle}
        </TextDefault>
      </View>
      {!!props?.status && <View style={[styles(currentTheme).rightContainer, props?.error && styles(currentTheme).errorContainer]}>
        <TextDefault
          textColor={props?.error ? currentTheme.colors.danger : currentTheme.colors.textSecondary}
          small
          bold
          numberOfLines={1}
          center>
          {props?.status}
        </TextDefault>
      </View>}
    </View>
  )
}

export default TitleComponent
