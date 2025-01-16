import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { useTranslation } from 'react-i18next'

function TitleComponent(props) {
  const { i18n } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}


  return (
    <View style={styles(currentTheme).mainContainer}>
      <View>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontMainColor}
          H6
          bolder
          isRTL>
          {props?.title}
        </TextDefault>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontSecondColor}
          small
          isRTL
        >
          {props?.subTitle}
        </TextDefault>
      </View>
      <View style={styles(currentTheme).rightContainer}>
        <TextDefault
          textColor={
            currentTheme.color2
          }
          H6
          center>
          {props?.status}
        </TextDefault>
      </View>
    </View>
  )
}

export default TitleComponent
