import React, { useState, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { AntDesign } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'

function CartComponent(props) {
  const { t } = useTranslation()
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
      <View style={styles(currentTheme).actionContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).actionContainerBtns,
            styles(currentTheme).minusBtn
          ]}
          onPress={onRemove}>
          <AntDesign
            name={props.quantity < 2 ? 'delete' : 'minus'}
            size={scale(18)}
            color={currentTheme.color4}
          />
        </TouchableOpacity>

        <View style={styles(currentTheme).actionContainerView}>
          <TextDefault H5 bold textColor={currentTheme.black}>
          {quantity}
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[
            styles(currentTheme).actionContainerBtns,
            styles(currentTheme).plusBtn
          ]}
          onPress={onAdd}>
          <AntDesign name="plus" size={scale(18)} color={currentTheme.white} />
        </TouchableOpacity>
      </View>
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
