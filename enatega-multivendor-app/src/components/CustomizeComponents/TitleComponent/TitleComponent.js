import React, { useContext } from 'react'
import { View } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'

function TitleComponent(props) {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View style={styles.mainContainer}>
      <View style={styles.leftContainer}>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontMainColor}
          H6
          bolder>
          {props.title}
        </TextDefault>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontSecondColor}
          small
        >
          {props.subTitle}
        </TextDefault>
      </View>
      <View style={styles.rightContainer}>
        <TextDefault
          textColor={
            currentTheme.color2
          }
          H6
          center>
          {props.status}
        </TextDefault>
      </View>
    </View>
  )
}

export default TitleComponent
