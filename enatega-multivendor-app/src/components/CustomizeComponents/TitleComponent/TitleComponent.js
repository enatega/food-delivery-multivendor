import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import CustomTheme from '../../../utils/themeColors1'
import TextDefault from '../../Text/TextDefault/TextDefault'

function TitleComponent(props) {
  const { theme } = CustomTheme()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftContainer}>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontMainColor}
          H4
          bolder>
          {props.title}
        </TextDefault>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontSecondColor}
          H6
          bold>
          {props.subTitle}
        </TextDefault>
      </View>
      <View style={styles(currentTheme).rightContainer}>
        <TextDefault
          textColor={
            props.error === true
              ? currentTheme.titleTextError
              : currentTheme.black
          }
          H6
          bold
          center>
          {props.status}
        </TextDefault>
      </View>
    </View>
  )
}

export default TitleComponent
