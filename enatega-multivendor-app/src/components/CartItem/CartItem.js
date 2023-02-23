import React, { useContext } from 'react'
import { TouchableOpacity, View } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'

const cartItem = props => {
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={styles().itemContainer}>
      <View style={styles(currentTheme).actionContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).actionContainerBtns}
          onPress={props.removeQuantity}>
          <AntDesign
            name="minus"
            size={scale(14)}
            color={currentTheme.iconColorPink}
          />
        </TouchableOpacity>
        <View style={styles(currentTheme).actionContainerView}>
          <TextDefault textColor={currentTheme.fontMainColor}>
            {props.quantity}
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).actionContainerBtns}
          onPress={props.addQuantity}>
          <AntDesign
            name="plus"
            size={scale(14)}
            color={currentTheme.iconColorPink}
          />
        </TouchableOpacity>
      </View>
      <View style={[alignment.PLsmall, { width: '50%' }]}>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontSecondColor}
          bold
          small>
          {props.dealName}
        </TextDefault>
        {props.optionsTitle.map((option, index) => (
          <TextDefault
            key={`options${props.dealName + option + index}`}
            numberOfLines={1}
            textColor={currentTheme.fontSecondColor}
            small>
            +{option}
          </TextDefault>
        ))}
      </View>
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontMainColor}
        style={{ width: '30%' }}
        small
        right>
        {configuration.currencySymbol}
        {parseFloat(props.dealPrice).toFixed(2)}
      </TextDefault>
    </View>
  )
}

export default cartItem
