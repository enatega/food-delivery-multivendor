import React, { useContext } from 'react'
import { View, FlatList, Text } from 'react-native'
import UserContext from '../../../context/User'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import { gql, useQuery } from '@apollo/client'
import { recentOrderRestaurantsInfo } from '../../../apollo/queries'
import { LocationContext } from '../../../context/Location'

const RECENT_ORDER_RESTAURANTS = gql`
  ${recentOrderRestaurantsInfo}
`

function OrderAgain(props) {
  const { location } = useContext(LocationContext)
  const { t } = useTranslation()
  const { isLoggedIn, profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  const { loading, error, data } = useQuery(RECENT_ORDER_RESTAURANTS, {
    variables: {
      latitude: location.latitude,
      longitude: location.longitude
    },
    skip:!isLoggedIn
  })

  
  if (!isLoggedIn) return null
  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  console.log(isLoggedIn, loading, error, data)
  return (
    <View style={styles().orderAgainSec}>
      {isLoggedIn && (
        <View >
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontFourthColor}
            bolder
            H4>
            Order it again
          </TextDefault>
          <TextDefault
            Normal
            textColor={currentTheme.secondaryText}
            style={
              styles().ItemDescription
            }>
            Most ordered right now.
          </TextDefault>
          <FlatList
            style={styles().offerScroll}
            contentContainerStyle={{ flexGrow: 1, ...alignment.PRlarge }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={data?.recentOrderRestaurants}
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
              return <NewRestaurantCard {...item} />
            }}
          />
        </View>
      )}
    </View>
  )
}

export default OrderAgain
