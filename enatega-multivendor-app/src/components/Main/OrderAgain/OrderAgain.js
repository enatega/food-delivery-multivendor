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
import MainLoadingUI from '../LoadingUI/MainLoadingUI'

function OrderAgain(props) {
  const { t } = useTranslation()
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  if (props?.loading) return <MainLoadingUI />
  if (props?.error) return <Text>Error: {props?.error?.message}</Text>

  return (
    <View style={styles().orderAgainSec}>
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
    </View>
  )
}

export default OrderAgain
