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
          H5
          bolder>
          {props.title}
        </TextDefault>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontSecondColor}
          H5
          style={{ marginVertical: 10 }}
          bolder>
          {props.subTitle}
        </TextDefault>
      </View>
      <View style={styles.rightContainer}>
        <View
          style={{
            backgroundColor:
              props.error === true
                ? currentTheme.textErrorColor
                : currentTheme.darkBackground,
            borderRadius: 10,
            padding: 2
          }}>
          <TextDefault
            textColor={
              props.error === true
                ? currentTheme.titleTextError
                : currentTheme.menuBar
            }
            H6
            center>
            {props.status}
          </TextDefault>
        </View>
      </View>
    </View>
  )
}

export default TitleComponent
