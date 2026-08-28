import React, { useContext, useMemo } from 'react'
import { Text, View } from 'react-native'
import { scale } from '../../utils/scaling'
import styles from './styles'
import ConfigurationContext from '../../context/Configuration'
import { IMAGE_LINK } from '../../utils/constants'
import TextDefault from '../Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { formatNumber } from '../../utils/formatNumber'
import { RectButton } from 'react-native-gesture-handler'
import ShimmerImage from '../ShimmerImage/ShimmerImage'
import { useMultivendorTheme } from '../../ui/designSystem'

const ItemCard = ({ item, onPressItem, restaurant, tagCart }) => {
  const themeContext = useContext(ThemeContext)
  const { tokens } = useMultivendorTheme()
  const currentTheme = useMemo(
    () => ({ ...theme[themeContext.ThemeValue], ...tokens }),
    [themeContext.ThemeValue, tokens]
  )
  const configuration = useContext(ConfigurationContext)

  const handleAddToCart = () => {
    onPressItem({
      ...item,
      restaurant: restaurant._id,
      restaurantName: restaurant.name
    })
  }

  const imageUrl = item?.image && item?.image?.trim() !== '' ? item?.image : IMAGE_LINK

  return (
    <RectButton
      onPress={handleAddToCart}
      rippleColor={currentTheme.rippleColor}
      style={styles(currentTheme).button}
    >
      <View style={styles(currentTheme).card}>
        {tagCart(item?._id)}
        <TextDefault
          textColor={currentTheme.colors.textPrimary}
          style={{
            fontSize: scale(12),
            fontWeight: '600',
            marginBottom: scale(11)
          }}
          isRTL
        >
          {item?.title}
        </TextDefault>
        <View style={{ alignItems: 'center', marginTop: 'auto' }}>
          <ShimmerImage
            imageUrl={imageUrl}
            style={styles(currentTheme).image}
            resizeMode='cover'
            defaultSource={require('../../assets/images/food_placeholder.png')}
          />
          <View style={styles().popularMenuPrice}>
            <Text style={styles(currentTheme).priceText}>{`${configuration.currencySymbol}${formatNumber(item?.variations[0].price)}`}</Text>
            {item?.variations[0]?.discounted > 0 && (
              <Text
                style={{
                  color: currentTheme.colors.textMuted,
                  fontSize: scale(12),
                  textDecorationLine: 'line-through'
                }}
              >
                {`${configuration?.currencySymbol} ${formatNumber(parseFloat(item?.variations[0]?.price + item?.variations[0]?.discounted).toFixed(0))}`}
              </Text>
            )}
          </View>
        </View>
      </View>
    </RectButton>
  )
}

export { ItemCard }
export default ItemCard
