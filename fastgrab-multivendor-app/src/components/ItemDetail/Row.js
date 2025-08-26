import { View, Image, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import { scale } from '../../utils/scaling'
import TextDefault from '../Text/TextDefault/TextDefault'
import { AntDesign } from '@expo/vector-icons'
import ThemeContext from '../../ui/ThemeContext/ThemeContext'
import { theme } from '../../utils/themeColors'
import { styles as getStyles } from './styles'
import { gql, useApolloClient } from '@apollo/client'
import { food } from '../../apollo/queries'
import ConfigurationContext from '../../context/Configuration'
import { useNavigation } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'
import { IMAGE_LINK } from '../../utils/constants'

const FOOD = gql`${food}`

export default function Row({ id, restaurant }) {
  const { i18n } = useTranslation()
  const configuration = useContext(ConfigurationContext)
  const navigation = useNavigation()
  const client = useApolloClient()
  const themeContext = useContext(ThemeContext)
  const currentTheme = {isRTL: i18n.dir() === 'rtl', ...theme[themeContext.ThemeValue]}
  const styles = getStyles(currentTheme)

  const food = client.readFragment({ id: `Food:${id}`, fragment: FOOD })
  const onAdd = () => {
    navigation.push('ItemDetail', {
      food: {
        ...food,
        restaurantName: restaurant?.name
      },
      addons: restaurant?.addons,
      options: restaurant?.options,
      restaurant: restaurant?._id
    })
  }

  return (
    <TouchableOpacity onPress={onAdd} style={{ flexDirection: currentTheme?.isRTL ? 'row-reverse' : 'row', marginBottom: scale(10) }}>
      {food?.image &&
      <View leftContainer >
        <Image style={styles.image} source={{ uri: food?.image || IMAGE_LINK }}/>
      </View>}

      <View mainContainer style={{ flex: 3, alignSelf: 'center', alignContent: 'center', paddingHorizontal: scale(10) }}>
        <TextDefault bolder small textColor={currentTheme.newFontcolor} style={{ marginBottom: scale(10), }} isRTL>{food?.title}</TextDefault>
        <TextDefault bolder small textColor={currentTheme.newFontcolor} isRTL>{`${configuration.currencySymbol}${food?.variations[0].price}`}</TextDefault>
      </View>
      <View rightContainer style={{ flex: 1, justifyContent: 'center', alignItems: currentTheme?.isRTL ? 'flex-start' : 'flex-end' }}>
        <View
          activeOpacity={0.7}
          style={styles.actionContainerBtns}
        >
          <AntDesign name="plus" size={scale(10)} color={currentTheme.themeBackground} />
        </View>
      </View>

    </TouchableOpacity>
  )
}
