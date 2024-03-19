import React, { useContext } from 'react'
import { View, FlatList, Text } from 'react-native'
import styles from '../OrderAgain/styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import { useTranslation } from 'react-i18next'
import NewRestaurantCard from '../RestaurantCard/NewRestaurantCard'
import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder'

function TopPicks(props) {
  const { t } = useTranslation()
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

  if (props?.loading) return loadingScreen()
  if (props?.error)
    return <Text style={styles().margin}>Error: {props?.error?.message}</Text>

  return (
    <View style={styles().topPicksSec}>
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
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={props?.mostOrderedRestaurants}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          return <NewRestaurantCard {...item} />
        }}
      />
    </View>
  )
}

export default TopPicks
