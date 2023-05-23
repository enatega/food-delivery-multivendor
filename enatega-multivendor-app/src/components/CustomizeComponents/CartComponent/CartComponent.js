import React, { useState, useContext } from 'react'
import { View, TouchableOpacity } from 'react-native'
import styles from './styles'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { AntDesign } from '@expo/vector-icons'
import { scale } from '../../../utils/scaling'
import Animated from 'react-native-reanimated'

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
      <View style={[styles(currentTheme).buttonContainer]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).button}>
          <View style={styles().buttontLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onAdd}
                style={[styles().buttonTextLeft, styles(currentTheme).round]}>
                <AntDesign
                  name="plus"
                  size={scale(15)}
                  color={currentTheme.menuBar}
                />
              </TouchableOpacity>

              <Animated.Text
                style={[
                  styles(currentTheme).buttonTextLeft,
                  styles(currentTheme).two
                ]}>
                {quantity}
              </Animated.Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onRemove}
                style={[styles().buttonTextLeft, styles(currentTheme).round]}>
                <AntDesign
                  name="minus"
                  size={scale(15)}
                  color={currentTheme.menuBar}
                />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            onPress={props.onPress.bind(this, quantity)}
            style={[
              styles().buttonText,
              { backgroundColor: currentTheme?.startColor }
            ]}>
            <TextDefault
              textColor={currentTheme.backIconBackground}
              uppercase
              center
              bolder
              small>
              {'Add to Cart'}
            </TextDefault>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default CartComponent
