import React, { useContext } from 'react'
import { TouchableOpacity, View, Image } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { scale } from '../../utils/scaling'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import ConfigurationContext from '../../context/Configuration'
import { theme } from '../../utils/themeColors'
import styles from './styles'
import TextDefault from '../Text/TextDefault/TextDefault'
import { alignment } from '../../utils/alignment'
import FoodPlaceHolder from '../../assets/SVG/food-placeholder'

const CartItem = ({
  quantity,
  title,
  variation,
  addons,
  price,
  image,
  addQuantity,
  removeQuantity
}) => {
  const configuration = useContext(ConfigurationContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  return (
    <View style={styles().itemContainer}>
      <View style={styles(currentTheme).actionContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).actionContainerBtns}
          onPress={removeQuantity}>
          <AntDesign
            name="minus"
            size={scale(10)}
            color={currentTheme.fontMainColor}
          />
        </TouchableOpacity>
        <View style={styles(currentTheme).actionContainerView}>
          <TextDefault textColor={currentTheme.fontMainColor}>
            {quantity}
          </TextDefault>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles(currentTheme).actionContainerBtns}
          onPress={addQuantity}>
          <AntDesign
            name="plus"
            size={scale(12)}
            color={currentTheme.fontMainColor}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[
          alignment.PLsmall,
          { alignSelf: 'flex-start', flexDirection: 'row', flex: 1 }
        ]}>
        {image ? (
          <Image
            style={{ width: 50, height: 50, borderRadius: 10 }}
            source={{ uri: image }}
          />
        ) : (
          <FoodPlaceHolder />
        )}
        <View style={{ marginLeft: 5 }}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.secondary}
            bold
            H5>
            {title}
          </TextDefault>
          <TextDefault numberOfLines={1} bold small>
            {variation.title}
          </TextDefault>
          <TextDefault style={{ marginTop: 5 }} numberOfLines={1} smaller>
            {addons
              .map(({ title }, index) => title)
              .flat()
              .join(',')}
          </TextDefault>
        </View>
      </View>
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontMainColor}
        style={{ width: '30%', alignSelf: 'flex-end' }}
        small
        right
        bold>
        {configuration.currencySymbol} {parseFloat(price).toFixed(2)}
      </TextDefault>
    </View>
  )
}

export default CartItem
