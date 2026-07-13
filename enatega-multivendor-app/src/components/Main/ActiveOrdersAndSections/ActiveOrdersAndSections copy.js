import React, { useContext } from 'react'
import { View, FlatList } from 'react-native'
import ActiveOrders from '../ActiveOrders'
import UserContext from '../../../context/User'
import styles from './styles'
import TextDefault from '../../Text/TextDefault/TextDefault'
import { alignment } from '../../../utils/alignment'
import ThemeContext from '../../../ui/ThemeContext/ThemeContext'
import { theme } from '../../../utils/themeColors'
import RestaurantCard from './RestaurantCard'
import { scale } from '../../../utils/scaling'
import {useTranslation} from 'react-i18next'


function ActiveOrdersAndSections(props) {
  const {t} = useTranslation()
  const { sections } = props
  const { isLoggedIn, profile } = useContext(UserContext)
  const themeContext = useContext(ThemeContext)
  const currentTheme = theme[themeContext.ThemeValue]

  return (
    <View>
      <View>{isLoggedIn && profile && <ActiveOrders />}</View>
      {sections.map(resSection => (
        <View key={resSection._id}>
          <TextDefault
            numberOfLines={1}
            textColor={currentTheme.fontMainColor}
            style={{
              ...alignment.MLlarge,
              ...alignment.PBsmall,
              ...alignment.PTmedium
            }}
            bolder
            H3>
            {resSection.name}
          </TextDefault>
          <View style={{ width: '100%' }}>
            <FlatList
              style={styles().offerScroll}
              contentContainerStyle={{ flexGrow: 1, ...alignment.PRlarge }}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={resSection ? resSection.restaurants : []}
              keyExtractor={(item, index) => item._id}
              renderItem={({ item }) => {
                return <RestaurantCard {...item} />
              }}
            />
          </View>
        </View>
      ))}
      <TextDefault
        numberOfLines={1}
        textColor={currentTheme.fontMainColor}
        style={{
          ...alignment.MLlarge,
          ...alignment.PBsmall,
          marginRight: scale(20)
        }}
        bolder
        H3>
        {t('allRestaurant')}
      </TextDefault>
    </View>
  )
}

export default ActiveOrdersAndSections
