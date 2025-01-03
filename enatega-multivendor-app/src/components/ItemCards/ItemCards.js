import React from 'react'
import { Image, Text, View, TouchableOpacity, Alert } from 'react-native'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { useContext } from 'react'
import ConfigurationContext from '../../context/Configuration'
import { IMAGE_LINK } from '../../utils/constants'
import TextDefault from '../Text/TextDefault/TextDefault'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { formatNumber } from '../../utils/formatNumber'
import { LinearGradient } from 'expo-linear-gradient'

const ItemCard = ({ item, onPressItem, restaurant, tagCart }) => {

  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]
  const configuration = useContext(ConfigurationContext)

  const handleAddToCart = () => {
    // if (item.isOutOfStock) {
    //   // Display an alert if the item is out of stock
    //   Alert.alert('Currently Unavailable', 'Item Out of Stock')
    // } else {
    //   onPressItem({
    //     ...item,
    //     restaurant: restaurant._id,
    //     restaurantName: restaurant.name
    //   })
    // }
    onPressItem({
      ...item,
      restaurant: restaurant._id,
      restaurantName: restaurant.name
    })
  }

  const imageUrl =
    item?.image && item?.image?.trim() !== '' ? item?.image : IMAGE_LINK

  return (
    <TouchableOpacity
      onPress={handleAddToCart}
      // Set opacity to 0.5 if item is out of stock, otherwise 1
      // style={{ opacity: item.isOutOfStock ? 0.5 : 1 }}
      // disabled={item.isOutOfStock}
    >
      <LinearGradient
        style={styles(currentTheme).card}
        colors={[currentTheme.gray100, currentTheme.white]}
      >
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
          <Image
            source={{ uri: imageUrl }}
            style={[
              { width: 138, height: 120, borderRadius: 8 },
              styles().popularMenuImg
            ]}
          />
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>
              {`${configuration.currencySymbol}${formatNumber(item?.variations[0].price)}`}
            </Text>
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
    </TouchableOpacity>
  )
}

export default ItemCard
