import React, { useContext } from 'react'
import { View, FlatList, Text } from 'react-native'
import UserContext from '../../../context/User'
import styles from '../OrderAgain/styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { scale } from '../../../utils/scaling'
import { useTranslation } from 'react-i18next'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import { gql, useQuery } from '@apollo/client'
import { mostOrderdRestaurantsInfo } from '../../../apollo/queries'
import { LocationContext } from '../../../context/Location'

const MOST_ORDERED_RESTAURANTS = gql`
  ${mostOrderdRestaurantsInfo}
`
function TopPicks(props) {
  const { location } = useContext(LocationContext)

  const { loading, error, data } = useQuery(MOST_ORDERED_RESTAURANTS, {
    variables: {
      latitude: location.latitude,
      longitude: location.longitude
    }
  })

  const { t } = useTranslation()
  const { isLoggedIn, profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error: {error.message}</Text>

  console.log(isLoggedIn, loading, error, data)
  return (
    <View>
      <View style={{ width: '100%' }}>
        <TextDefault
          numberOfLines={1}
          textColor={currentTheme.fontFourthColor}
          style={{
            ...alignment.MLlarge
          }}
          bolder
          H4>
          Top Picks for you
        </TextDefault>
        <TextDefault
          Normal
          textColor={currentTheme.secondaryText}
          style={[
            styles().ItemDescription,
            {
              ...alignment.MLlarge
            }
          ]}>
          Most ordered right now.
        </TextDefault>
        <FlatList
          style={styles().offerScroll}
          contentContainerStyle={{ flexGrow: 1, ...alignment.PRlarge }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={data?.mostOrderedRestaurants}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return <NewRestaurantCard {...item} />
          }}
        />
      </View>
    </View>
  )
}

export default TopPicks
