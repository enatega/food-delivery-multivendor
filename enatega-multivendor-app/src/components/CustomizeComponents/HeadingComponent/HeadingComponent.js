import React, { useContext } from 'react'
import { View } from 'react-native'
import ConfigurationContext from '../../../context/Configuration'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { formatNumber } from '../../../utils/formatNumber'

function HeadingComponent(props) {
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View>
      <View style={styles.topContainer}>
        <View style={styles.titleContainer}>
          <TextDefault
            numberOfLines={2}
            textColor={currentTheme.fontMainColor}
            H4
            bolder>
            {props.title}
          </TextDefault>
        </View>
        <View style={styles.priceContainer}>
          <TextDefault
            textColor={currentTheme.fontMainColor}
            H4
            bolder>{`${configuration.currencySymbol}${formatNumber(props.price)}`}</TextDefault>
        </View>
      </View>
      <View style={styles.descContainer}>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontSecondColor}
          H4
          bold>
          {props.desc}
        </TextDefault>
      </View>
    </View>
  )
}

export default HeadingComponent
