import React, { useContext } from 'react'
import { View, FlatList, Text } from 'react-native'
import UserContext from '../../../context/User'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'

function OrderAgain(props) {
  const { t } = useTranslation()
  const { isLoggedIn } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  function loadingScreen() {
    return (
      <View style={styles(currentTheme).screenBackground}>
        <Placeholder
          Animation={props => (
            <Fade
              {...props}
              style={styles(currentTheme).placeHolderFadeColor}
              duration={600}
            />
          )}
          style={styles(currentTheme).placeHolderContainer}>
          <PlaceholderLine style={styles().height200} />
          <PlaceholderLine />
        </Placeholder>
      </View>
    )
  }

  if (!isLoggedIn) return null
  if (props?.loading) return loadingScreen()
  if (props?.error) return <Text>Error: {props?.error?.message}</Text>

  return (
    <View style={styles().orderAgainSec}>
      {isLoggedIn && (
        <View>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontFourthColor}
            bolder
            H4>
            {props?.title}
          </TextDefault>
          <TextDefault
            Normal
            textColor={currentTheme.secondaryText}
            style={styles().ItemDescription}>
            Most ordered right now.
          </TextDefault>
          <FlatList
            style={styles().offerScroll}
            contentContainerStyle={{ flexGrow: 1, ...alignment.PRlarge }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={props?.recentOrderRestaurants}
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
