import React from 'react'
import { Image, Text, View, TouchableOpacity } from 'react-native'
import { scale } from '../../utils/scaling'
import styles from './styles'
import { useContext } from 'react'
import ConfigurationContext from '../../context/Configuration'
import { IMAGE_LINK } from '../../utils/constants'

const ItemCard = ({ item, onPressItem, restaurant, tagCart }) => {
  const configuration = useContext(ConfigurationContext)
  const handleAddToCart = () => {
    onPressItem({
      ...item,
      restaurant: restaurant._id,
      restaurantName: restaurant.name
    })
  }
  const imageUrl =
    item.image && item.image.trim() !== '' ? item.image : IMAGE_LINK

  return (
    <TouchableOpacity onPress={handleAddToCart}>
      <View style={styles().card}>
        {tagCart(item._id)}
        <Text
          style={{
            color: '#4B5563',
            fontSize: scale(12),
            fontWeight: '600',
            marginBottom: scale(11)
          }}>
          {item.title}
        </Text>
        <View style={{ alignItems: 'center' }}>
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              style={[{ width: 138, height: 120 }, styles().popularMenuImg]}
            />
          ) : (
            <View style={[{ width: 138, height: 120 }, styles().popularMenuImg]} />
          )}
          <View style={styles().popularMenuPrice}>
            <Text style={{ color: '#1C1C1E', fontSize: scale(12) }}>
              {`${configuration.currencySymbol}${item.variations[0].price}`}
            </Text>
            {item.variations[0].discounted > 0 && (
              <Text
              style={{
                color: '#9CA3AF',
                fontSize: scale(12),
                textDecorationLine: 'line-through'
              }}>
                {`${configuration.currencySymbol} ${parseFloat(item.variations[0].price + item.variations[0].discounted).toFixed(2)}`}

            </Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ItemCard
