import React, { useState, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { AntDesign } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import {useTranslation} from 'react-i18next'

function CartComponent(props) {
  const {t} = useTranslation()
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
          <AntDesign name="minus" size={scale(16)} color={currentTheme.white} />
        </TouchableOpacity>
        <TextDefault
          textColor={currentTheme.fontMainColor}
          style={styles().quantity}
          H4
          bold
          center>
          {quantity}
        </TextDefault>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onAdd}
          style={styles().icon}>
          <AntDesign name="plus" size={scale(16)} color={currentTheme.white} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={props.onPress.bind(this, quantity)}
          style={
            !props.disabled
              ? styles(currentTheme).btnContainer
              : {
                  ...styles().btnContainer,
                  backgroundColor: currentTheme.main
                }
          }>
          <TextDefault textColor={currentTheme.black} H5 bolder center>
            {t('addToCart')}
          </TextDefault>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CartComponent
