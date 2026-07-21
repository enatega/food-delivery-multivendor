import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { scale } from '../../utils/scaling'
import styles from './styles'
import ConfigurationContext from '../../context/Configuration'
import { IMAGE_LINK } from '../../utils/constants'
import TextDefault from '../Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { formatNumber } from '../../utils/formatNumber'
import { LinearGradient } from 'expo-linear-gradient'
import { RectButton } from 'react-native-gesture-handler'
import ShimmerImage from '../ShimmerImage/ShimmerImage'

const ItemCard = ({ item, onPressItem, restaurant, tagCart }) => {
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
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
    <RectButton onPress={handleAddToCart} rippleColor={currentTheme.rippleColor}>
      <LinearGradient style={styles(currentTheme).card} colors={[currentTheme.gray100, currentTheme.white]}>
        {tagCart(item?._id)}
        <TextDefault
          textColor={currentTheme.gray600}
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
            style={[{ width: 138, height: 120, borderRadius: 8 }, styles().popularMenuImg]}
            resizeMode='cover'
            defaultSource={require('../../assets/images/food_placeholder.png')}
          />
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>{`${configuration.currencySymbol}${formatNumber(item?.variations[0].price)}`}</Text>
            {item?.variations[0]?.discounted > 0 && (
              <Text
                style={{
                  color: '#9CA3AF',
                  fontSize: scale(12),
                  textDecorationLine: 'line-through'
                }}
              >
                {`${configuration?.currencySymbol} ${formatNumber(parseFloat(item?.variations[0]?.price + item?.variations[0]?.discounted).toFixed(0))}`}
              </Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </RectButton>
  )
}

export { ItemCard }
export default ItemCard
