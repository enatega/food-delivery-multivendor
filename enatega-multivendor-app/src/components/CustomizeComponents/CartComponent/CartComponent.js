import React, { useState, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { AntDesign } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'

function CartComponent(props) {
  const [quantity, setQuantity] = useState(1)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  function onAdd() {
    setQuantity(quantity + 1)
  }
  function onRemove() {
    if (quantity === 1) return
    setQuantity(quantity - 1)
  }

  return (
    <View style={styles(currentTheme).mainContainer}>
      <View style={styles().subContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onRemove}
          style={styles().icon}>
          <AntDesign
            name="minus"
            size={scale(25)}
            color={currentTheme.iconColorPink}
          />
        </TouchableOpacity>
        <TextDefault textColor={currentTheme.fontMainColor} H4 bold center>
          {quantity}
        </TextDefault>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAdd}
          style={styles().icon}>
          <AntDesign
            name="plus"
            size={scale(25)}
            color={currentTheme.iconColorPink}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={props.onPress.bind(this, quantity)}
          style={
            !props.disabled
              ? styles(currentTheme).btnContainer
              : {
                ...styles().btnContainer,
                backgroundColor: currentTheme.buttonBackground
              }
          }>
          <TextDefault
            textColor={currentTheme.buttonText}
            H5
            bold
            center
            uppercase>
            ADD TO CART
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CartComponent
